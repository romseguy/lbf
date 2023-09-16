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
import React, { ComponentType, useEffect, useState } from "react";
import { bytesForHuman } from "utils/string";

export const FileInput = ({
  accept = "*",
  maxFileSize = 10,
  TableContainer,
  list,
  setList,
  onChange,
  ...props
}: InputProps & {
  maxFileSize?: number;
  TableContainer?: ComponentType<{ children: React.ReactNode }>;
  list?: File[];
  setList?: React.Dispatch<React.SetStateAction<File[]>>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const toast = useToast({ position: "top" });

  const handleDelete = (i: number) => {
    if (list && setList) {
      const newList = list.filter((f, index) => index !== i);
      setList(newList);
    }
  };

  const table =
    list && setList && list.length > 0 ? (
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
                  <button
                    key={i + ":del"}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(i);
                    }}
                  >
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
        type="file"
        accept={accept}
        onChange={(event) => {
          onChange && onChange(event);
          const files = event.target.files;

          if (setList && files) {
            //@ts-expect-error
            let newList: File[] = [].concat(list);

            for (const file of Array.from(files)) {
              const fsMb = file.size / (1024 * 1024);
              if (fsMb < maxFileSize) newList = newList.concat([file]);
            }
            setList(newList);
          }
        }}
      />
    </>
  );
};

{
  /*
    const handleUp = (i: number) => {
      const temp = list[i];
      list[i] = list[i - 1];
      list[i - 1] = temp;
      triggerUpdate();
    };

    const handleDown = (i: number) => {
      const temp = list[i];
      list[i] = list[i + 1];
      list[i + 1] = temp;
      triggerUpdate();
    };
  */
}
