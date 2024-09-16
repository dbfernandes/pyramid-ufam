import { Column } from "components/shared/Table";

export default function Workload({ workloadCount }) {
  return (
    workloadCount
      ? <>
        <Column hideOnMobile={true}>{workloadCount?.["Ensino"]?.totalWorkload}h</Column>
        <Column hideOnMobile={true}>{workloadCount?.["Pesquisa"]?.totalWorkload}h</Column>
        <Column hideOnMobile={true}>{workloadCount?.["Extensão"]?.totalWorkload}h</Column>
      </>
      : null
  )
}