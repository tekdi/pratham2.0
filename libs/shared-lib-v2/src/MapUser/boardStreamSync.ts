import { post } from '../DynamicForm/services/RestClient';

// Keeps the "stream" multi-select in sync with whatever boards are
// currently selected - covers individual board add/remove and "Select All"
// uniformly, since all three funnel through the same board value change.
// Resolves board->stream associations (direct or via an intermediate
// category) through the framework association graph rather than any
// hardcoded board/stream mapping, so it works for any board/stream set.
export const syncStreamsForBoardChange = async (
  formData: Record<string, any>,
  schema: any,
  applyStreamUpdate: (nextStreamValues: string[]) => void
) => {
  if (!schema?.properties?.board || !schema?.properties?.stream) {
    return;
  }

  const boardValues = Array.isArray(formData?.board) ? formData.board : [];
  const currentStreamValues = Array.isArray(formData?.stream)
    ? formData.stream
    : [];
  const boardFetchUrl = schema.properties.board?.api?.payload?.fetchUrl;

  if (!boardFetchUrl) {
    return;
  }

  if (!boardValues.length) {
    if (currentStreamValues.length) {
      applyStreamUpdate([]);
    }
    return;
  }

  try {
    const streamCategoryCode =
      schema.properties.stream?.api?.payload?.findcode || 'stream';
    const response = await post('/api/dynamic-form/get-framework', {
      code: 'board',
      fetchUrl: boardFetchUrl,
      selectedvalue: boardValues,
      findcode: streamCategoryCode,
    });
    const associatedStreams: string[] = (response?.data?.options || []).map(
      (opt: any) => opt.value
    );

    const isSameSet =
      associatedStreams.length === currentStreamValues.length &&
      associatedStreams.every((stream) => currentStreamValues.includes(stream));

    if (!isSameSet) {
      applyStreamUpdate(associatedStreams);
    }
  } catch (error) {
    console.error('Error syncing streams with selected boards:', error);
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
