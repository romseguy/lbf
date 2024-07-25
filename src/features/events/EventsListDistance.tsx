import { Select, SelectProps } from "@chakra-ui/react";

export const EventsListDistanceSelect = ({
  city,
  distance,
  setDistance,
  ...props
}: SelectProps & {
  city: string;
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
      <option value={5}>5km de {city}</option>
      <option value={10}>10km de {city}</option>
      <option value={20}>20km de {city}</option>
      <option value={30}>30km de {city}</option>
      <option value={50}>50km de {city}</option>
      <option value={100}>100km de {city}</option>
      <option value={200}>200km de {city}</option>
    </Select>
  );
};
