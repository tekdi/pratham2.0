import { post } from '../DynamicForm/services/RestClient';

// DynamicForm has its own generic "dependent field" cascade: whenever a
// field named as another field's `api.dependent` changes, it clears that
// field's value and re-fetches its enum via a plain (direct-associations-
// only) lookup. If the schema also marks "stream" as dependent on "board",
// that generic cascade fires in parallel with syncStreamsForBoardChange
// below on every board change - and being a separate, independently-timed
// fetch, whichever of the two resolves last wins, so the more complete
// association-graph result here can get silently clobbered back down to
// the narrower direct-only one depending on network timing. Since this
// module's live sync + the submit-time prune already fully own "stream"'s
// options and value, this strips just enough from a cloned copy of the
// field's `api` config (`dependent`/`callType`) to opt "stream" out of
// that generic cascade, while leaving `api.payload` (read elsewhere in
// this module, e.g. for `findcode`) intact, and leaving every other field
// - and every other DynamicForm consumer, since this only touches the
// schema object these two forms hold locally - completely untouched.
export const withStreamCascadeDisabled = (schema: any) => {
  const streamApi = schema?.properties?.stream?.api;
  if (!streamApi) {
    return schema;
  }
  const { dependent, callType, ...restApi } = streamApi;
  return {
    ...schema,
    properties: {
      ...schema.properties,
      stream: {
        ...schema.properties.stream,
        api: restApi,
      },
    },
  };
};

// Low-level lookup shared by the two functions below: every stream
// associated with `boardValues`, resolved via the framework's association
// graph (so an indirect chain like board -> medium -> stream resolves too,
// not just a direct board->stream association).
const fetchStreamOptionsForBoards = async (
  boardValues: string[],
  schema: any
): Promise<{ label: string; value: string }[]> => {
  const boardFetchUrl = schema?.properties?.board?.api?.payload?.fetchUrl;
  if (!boardValues.length || !boardFetchUrl) {
    return [];
  }
  const streamCategoryCode =
    schema.properties.stream?.api?.payload?.findcode || 'stream';
  const response = await post('/api/dynamic-form/get-framework', {
    code: 'board',
    fetchUrl: boardFetchUrl,
    selectedvalue: boardValues,
    findcode: streamCategoryCode,
    useAssociationGraph: true,
  });
  return response?.data?.options || [];
};

// Keeps the "stream" multi-select in sync with whatever boards are
// currently selected - covers individual board add/remove and "Select All"
// uniformly, since all three funnel through the same board value change.
// Resolves board->stream associations (direct or via an intermediate
// category) through the framework association graph rather than any
// hardcoded board/stream mapping, so it works for any board/stream set.
export const syncStreamsForBoardChange = async (
  formData: Record<string, any>,
  schema: any,
  applyStreamUpdate: (
    nextStreamValues: string[],
    streamOptions: { label: string; value: string }[]
  ) => void
) => {
  if (!schema?.properties?.board || !schema?.properties?.stream) {
    console.warn(
      '[boardStreamSync] skipped: schema has no board/stream property',
      { hasBoard: !!schema?.properties?.board, hasStream: !!schema?.properties?.stream }
    );
    return;
  }

  const boardValues = Array.isArray(formData?.board) ? formData.board : [];
  const currentStreamValues = Array.isArray(formData?.stream)
    ? formData.stream
    : [];

  if (!schema.properties.board?.api?.payload?.fetchUrl) {
    console.warn(
      '[boardStreamSync] skipped: schema.properties.board.api.payload.fetchUrl is missing',
      schema.properties.board
    );
    return;
  }

  if (!boardValues.length) {
    if (currentStreamValues.length) {
      applyStreamUpdate([], []);
    }
    return;
  }

  try {
    console.log('[boardStreamSync] fetching streams for boards', boardValues);
    const streamOptions = await fetchStreamOptionsForBoards(boardValues, schema);
    console.log('[boardStreamSync] resolved stream options', streamOptions);
    const associatedStreams: string[] = streamOptions.map((opt) => opt.value);

    // Always push the fresh option list, even when the selected values
    // happen to already match - the widget can only show/check values that
    // are present in its own enum, and that enum needs to stay in sync with
    // whichever boards are currently selected too (it may otherwise still
    // be scoped to a previous, narrower board selection).
    applyStreamUpdate(associatedStreams, streamOptions);
  } catch (error) {
    console.error('Error syncing streams with selected boards:', error);
  }
};

// One-time initial-load companion to the live sync above: refreshes just
// the Stream widget's available options (via the same association-graph
// lookup) to match whichever board(s) are already selected when an edit
// form opens, WITHOUT touching the already-saved stream value - the saved
// selection is trusted as-is on load, only the option list it needs to
// render against is brought up to date. Needed because this module also
// takes "stream" out of DynamicForm's generic dependent-field cascade (see
// withStreamCascadeDisabled) to avoid it racing the live sync above, which
// means nothing else would populate Stream's options on initial load.
export const refreshInitialStreamOptions = async (
  formData: Record<string, any>,
  schema: any,
  applyOptions: (streamOptions: { label: string; value: string }[]) => void
) => {
  if (!schema?.properties?.board || !schema?.properties?.stream) {
    return;
  }
  const boardValues = Array.isArray(formData?.board) ? formData.board : [];
  if (!boardValues.length) {
    return;
  }
  try {
    const streamOptions = await fetchStreamOptionsForBoards(boardValues, schema);
    if (streamOptions.length) {
      applyOptions(streamOptions);
    }
  } catch (error) {
    console.error('Error loading initial stream options:', error);
  }
};

// Submit-time safety net: a user can have several boards selected at once,
// each with its own associated stream(s) (e.g. Board1->Stream1,
// Board4->Stream2 selected together). If a board is removed from the
// selection, any stream that was only valid for that board must go with
// it - otherwise a stale board/stream pairing gets saved. This re-checks
// the currently selected streams against the currently selected boards via
// the same framework association lookup the live sync above uses, and
// drops whichever streams no longer belong to any selected board. Boards
// whose pairing is still valid are left untouched, and if this form has no
// board+stream fields (or the board field lacks its usual framework lookup
// config) it's a no-op, leaving submission exactly as it was.
export const pruneStreamsForRemovedBoards = async (
  cleanedData: Record<string, any>,
  transformedPayload: Record<string, any>,
  schema: any
) => {
  const boardValues = Array.isArray(cleanedData?.board)
    ? cleanedData.board
    : [];
  const streamValues = Array.isArray(cleanedData?.stream)
    ? cleanedData.stream
    : [];
  const boardFetchUrl = schema?.properties?.board?.api?.payload?.fetchUrl;

  if (!boardValues.length || !streamValues.length || !boardFetchUrl) {
    return { cleanedData, transformedPayload };
  }

  try {
    const streamCategoryCode =
      schema?.properties?.stream?.api?.payload?.findcode || 'stream';
    const response = await post('/api/dynamic-form/get-framework', {
      code: 'board',
      fetchUrl: boardFetchUrl,
      selectedvalue: boardValues,
      findcode: streamCategoryCode,
      allowedValues: streamValues,
    });
    const validStreamNames = new Set(
      (response?.data?.options || []).map((opt: any) => opt.value)
    );
    const prunedStreams = streamValues.filter((stream: string) =>
      validStreamNames.has(stream)
    );

    if (prunedStreams.length === streamValues.length) {
      return { cleanedData, transformedPayload };
    }

    const streamFieldId = schema?.properties?.stream?.fieldId;
    const updatedPayload = { ...transformedPayload };
    if (streamFieldId && Array.isArray(updatedPayload.customFields)) {
      updatedPayload.customFields = updatedPayload.customFields.map(
        (field: any) =>
          field.fieldId === streamFieldId
            ? { ...field, value: prunedStreams }
            : field
      );
    } else if ('stream' in updatedPayload) {
      updatedPayload.stream = prunedStreams;
    }

    return {
      cleanedData: { ...cleanedData, stream: prunedStreams },
      transformedPayload: updatedPayload,
    };
  } catch (error) {
    console.error(
      'Error syncing stream selection with board selection:',
      error
    );
    return { cleanedData, transformedPayload };
  }
};
