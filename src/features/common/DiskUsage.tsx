import { Flex, FlexProps, Progress, Text } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { useDiskUsage } from "hooks/useDiskUsage";
import { useEffect } from "react";
import { removeProps } from "utils/object";
import * as stringUtils from "utils/string";
import { HostTag } from "./HostTag";

export const DiskUsage = (
  props: FlexProps & { refreshDiskUsage?: boolean }
) => {
  const [diskUsage, refreshDiskUsage] = useDiskUsage();
  useEffect(() => {
    refreshDiskUsage();
  }, [props.refreshDiskUsage]);

  return (
    <Flex flexWrap="wrap" {...removeProps(props, ["refreshDiskUsage"])}>
      <Flex flexDir="column" mt={3}>
        <HostTag mb={1} />
        <Progress hasStripe value={diskUsage.pct} />
        {typeof diskUsage.current !== "undefined" &&
          typeof diskUsage.max !== "undefined" && (
            <Flex alignItems="center" fontSize="smaller" mt={1}>
              <Text>
                {stringUtils.bytesForHuman(diskUsage.current)} sur{" "}
                {stringUtils.bytesForHuman(diskUsage.max)}
              </Text>
            </Flex>
          )}
      </Flex>
    </Flex>
  );
};
