import { getCohortList } from "@/services/CohortService/cohortService";
import React from "react";

const CenterLabel = ({ parentId }: any) => {
  const [centerLabel, setCenterLabel] = React.useState('-');

  React.useEffect(() => {
    let isMounted = true;
    const fetchLabel = async () => {
      const label = await getCenterLabel(parentId);
      if (isMounted) {
        setCenterLabel(label);
      }
    };
    fetchLabel();

    return () => {
      isMounted = false;
    };
  }, [parentId]);

  return <>{centerLabel}</>;
};

const getCenterLabel = async (parentId: any) => {
  try{const data = {
     limit: 100,
     offset: 0,
   // sort: sort,
    filters: {
      "cohortId": parentId
  },
  };
  const resp = await getCohortList(data)
  console.log((resp?.results?.cohortDetails[0]?.name))

  return  resp?.results?.cohortDetails[0]?.name? (resp?.results?.cohortDetails[0]?.name): "-"
//  console.log(resp?.results?.cohortDetails[0]?.name)

}
  catch(e)
  {
    console.log(e)
  }
  
//  console.log(resp)
};
export default CenterLabel;
