import Observations from '../../../../components/observations/Observations';

export default function Index({
  params,
}: {
  params: { observationId: string; entityId: string };
}) {
  return (
    <Observations
      observationId={params?.observationId}
      entityId={params?.entityId}
    />
  );
}
