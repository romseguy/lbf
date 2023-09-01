import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Input,
  InputProps
} from "@chakra-ui/react";
import React, { ComponentType, useState } from "react";
import { bytesForHuman } from "utils/string";

export const FileInput = ({
  accept = "*",
  maxFileSize = 10,
  TableContainer,
  value,
  register,
  name,
  onChange,
  ...props
}: InputProps & {
  maxFileSize?: number;
  TableContainer?: ComponentType<{ children: React.ReactNode }>;
  register: any;
  value?: FileList;
  onChange?: (files: File[]) => void;
}) => {
  const toast = useToast({ position: "top" });
  const [list, setList] = useState<File[]>(value ? Array.from(value) : []);

  const triggerUpdate = () => {
    setList(list.slice());
    onChange && onChange(list);
  };

  // const handleUp = (i: number) => {
  //   const temp = list[i];
  //   list[i] = list[i - 1];
  //   list[i - 1] = temp;
  //   triggerUpdate();
  // };

  // const handleDown = (i: number) => {
  //   const temp = list[i];
  //   list[i] = list[i + 1];
  //   list[i + 1] = temp;
  //   triggerUpdate();
  // };

  const handleDelete = (i: number) => {
    list.splice(i, 1);
    triggerUpdate();
  };

  const table =
    list && list.length > 0 ? (
      <Table>
        <Thead>
          <Tr>
            {/* <Th scope="col"></Th> */}
            <Th scope="col">Nom</Th>
            <Th scope="col">Taille</Th>
            <Th scope="col">Type</Th>
            <Th scope="col"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.map((item, i) => {
            return (
              <Tr key={i}>
                {/* <Td>
                  {i > 0 ? (
                    <button key={i + ":up"} onClick={(e) => handleUp(i)}>
                      {String.fromCharCode(9650)}
                    </button>
                  ) : i < list.length - 1 ? (
                    <button key={i + ":down"} onClick={(e) => handleDown(i)}>
                      {String.fromCharCode(9660)}
                    </button>
                  ) : null}
                </Td> */}
                <Td>
                  {/* {item.name.length > collapseLength
                      ? item.name.substr(0, collapseLength)
                      : item.name} */}
                  {item.name}
                </Td>
                <Td>{bytesForHuman(item.size, 2)}</Td>
                <Td>{item.type}</Td>
                <Td>
                  <button key={i + ":del"} onClick={(e) => handleDelete(i)}>
                    {String.fromCharCode(10006)}
                  </button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    ) : null;

  return (
    <>
      {table && TableContainer ? (
        <TableContainer>{table}</TableContainer>
      ) : (
        table
      )}

      <Input
        {...props}
        ref={register()}
        name={name}
        type="file"
        onChange={(e) => {
          const files = e.target.files;

          if (files) {
            for (const file of Array.from(files)) {
              const fsMb = file.size / (1024 * 1024);
              if (fsMb > maxFileSize)
                toast({ title: "Fichier trop volumineux", status: "error" });
              else list.push(file);
            }

            triggerUpdate();
          }
        }}
      />
    </>
  );
};
