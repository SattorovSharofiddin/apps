import { Box, Text, Chip, Button } from "@saleor/macaw-ui/next";
import { trpcClient } from "../../trpc/trpc-client";
import { useRouter } from "next/router";

const defaultAddressChip = (
  <Chip __display={"inline-block"} size={"large"}>
    <Text size={"small"} color={"textNeutralSubdued"}>
      Default
    </Text>
  </Chip>
);

export const PerChannelConfigList = () => {
  const shopChannelsQuery = trpcClient.channels.fetch.useQuery();
  const channelsOverridesQuery = trpcClient.appConfiguration.fetchChannelsOverrides.useQuery();

  const { push } = useRouter();

  if (shopChannelsQuery.isLoading || channelsOverridesQuery.isLoading) {
    return <Text color={"textNeutralSubdued"}>Loading...</Text>;
  }

  const renderChannelAddress = (slug: string) => {
    const overridesDataRecord = channelsOverridesQuery.data;

    if (!overridesDataRecord) {
      return null; // todo should throw
    }

    if (overridesDataRecord[slug]) {
      const address = overridesDataRecord[slug];

      /**
       * TODO extract address rendering
       */
      return (
        <Box>
          <Text size={"small"} as={"p"}>
            {address.companyName}
          </Text>
          <Text size={"small"} as={"p"}>
            {address.streetAddress1}
          </Text>
          <Text size={"small"} as={"p"}>
            {address.streetAddress2}
          </Text>
          <Text size={"small"}>
            {address.postalCode} {address.city}
          </Text>
          <Text size={"small"} as={"p"}>
            {address.country}
          </Text>
        </Box>
      );
    } else {
      return defaultAddressChip;
    }
  };

  const renderActionButtonAddress = (slug: string) => {
    const overridesDataRecord = channelsOverridesQuery.data;

    if (!overridesDataRecord) {
      return null; // todo should throw
    }

    return (
      <Button
        variant={"tertiary"}
        onClick={() => {
          push(`/configuration/${slug}`);
        }}
      >
        <Text color={"textNeutralSubdued"} size={"small"}>
          {overridesDataRecord[slug] ? "Edit" : "Set custom"}
        </Text>
      </Button>
    );
  };

  return (
    <Box>
      <Box display={"grid"} gridTemplateColumns={3} marginBottom={8}>
        <Text color={"textNeutralSubdued"} variant={"caption"} size={"small"}>
          Channel
        </Text>
        <Text color={"textNeutralSubdued"} variant={"caption"} size={"small"}>
          Address
        </Text>
      </Box>
      {shopChannelsQuery.data?.map((channel) => (
        <Box
          key={channel.id}
          display={"grid"}
          gridTemplateColumns={3}
          paddingY={4}
          borderBottomStyle={"solid"}
          borderBottomWidth={1}
          borderColor={"neutralHighlight"}
        >
          <Text variant={"bodyStrong"}>{channel.name}</Text>
          <Box>{renderChannelAddress(channel.slug)}</Box>
          <Box marginLeft={"auto"}> {renderActionButtonAddress(channel.slug)}</Box>
        </Box>
      ))}
    </Box>
  );
};
