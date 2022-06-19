import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

import { Input, InputProps } from "@chakra-ui/react";
import React, { useState } from "react";
import { bytesForHuman } from "utils/string";

export const FileInput = ({
  accept = "*",
  //maxFileSize = 10,
  value,
  onChange,
  ...props
}: InputProps & {
  //maxFileSize?: number;
  value?: FileList;
  onChange?: (files: File[]) => void;
}) => {
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

  const renderHtmlTable = () => {
    return (
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
                <Td>{item.name}</Td>
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
    );
  };

  const renderFileInput = () => {
    return (
      <Input
        {...props}
        type="file"
        onChange={(e) => {
          const files = e.target.files;

          if (files) {
            for (const file of Array.from(files)) {
              const fsMb = file.size / (1024 * 1024);
              //if (fsMb < maxFileSize) {
              list.push(file);
              //}
            }

            triggerUpdate();
          }
        }}
      />
    );
  };

  return (
    <>
      {list && list.length > 0 && renderHtmlTable()}
      {renderFileInput()}
    </>
  );
};
