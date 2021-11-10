import { Select, SelectProps } from "@chakra-ui/react";

export const EventsListDistance = ({
  distance,
  setDistance,
  ...props
}: SelectProps & {
  distance?: number;
  setDistance: (distance: number) => void;
}) => {
  return (
    <Select
      defaultValue={distance}
      display="inline-block"
      width="initial"
      onChange={(e) => setDistance(parseInt(e.target.value))}
      {...props}
    >
      <option value={0}>Afficher tous les événements</option>
      <option value={5}>5km</option>
      <option value={10}>10km</option>
      <option value={20}>20km</option>
      <option value={30}>30km</option>
      <option value={50}>50km</option>
      <option value={100}>100km</option>
      <option value={200}>200km</option>
    </Select>
  );
};
