import { Select, SelectProps } from "@chakra-ui/react";

type SelectedOrderType = { key: string; order: "asc" | "desc" } | undefined;

const orderList: { key: string; label: string; order: "asc" | "desc" }[] = [
  {
    key: "a-z",
    label: "A-Z",
    order: "asc"
  },
  {
    key: "z-a",
    label: "Z-A",
    order: "desc"
  }
];

export const ProjectsListOrder = ({
  selectedOrder,
  setSelectedOrder,
  ...props
}: SelectProps & {
  selectedOrder: SelectedOrderType;
  setSelectedOrder: (selectedOrder: SelectedOrderType) => void;
}) => {
  return (
    <Select
      placeholder="Changer l'ordre d'affichage"
      width="fit-content"
      onChange={(e) => {
        setSelectedOrder(orderList.find(({ key }) => key === e.target.value));
      }}
      {...props}
    >
      {orderList.map(({ key, label, order }) => {
        return (
          <option key={key + "-" + order} value={key}>
            {label}
          </option>
        );
      })}
    </Select>
  );
};
