import { Select, SelectProps } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

export interface ISelectedOrder {
  key: "projectName" | "createdAt";
  order: "asc" | "desc";
  label?: string;
}

const orderList: ISelectedOrder[] = [
  {
    key: "projectName",
    label: "De A à Z",
    order: "asc"
  },
  {
    key: "projectName",
    label: "De Z à A",
    order: "desc"
  },
  {
    key: "createdAt",
    label: "Du plus ancien au plus récent",
    order: "asc"
  },
  {
    key: "createdAt",
    label: "Du plus récent au plus ancien",
    order: "desc"
  }
];

export const ProjectsListOrder = ({
  selectedOrder,
  setSelectedOrder,
  ...props
}: SelectProps & {
  selectedOrder?: ISelectedOrder;
  setSelectedOrder: React.Dispatch<
    React.SetStateAction<ISelectedOrder | undefined>
  >;
}) => {
  return (
    <Select
      placeholder="Changer l'ordre d'affichage"
      width="fit-content"
      defaultValue={`${selectedOrder?.key}-${selectedOrder?.order}`}
      onChange={(e) => {
        setSelectedOrder(
          orderList.find(
            ({ key, order }) => `${key}-${order}` === e.target.value
          )
        );
      }}
      {...props}
    >
      {orderList.map(({ key, label, order }) => {
        return (
          <option key={key + "-" + order} value={`${key}-${order}`}>
            {label}
          </option>
        );
      })}
    </Select>
  );
};
