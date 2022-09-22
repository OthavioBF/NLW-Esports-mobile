import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Image, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { GameParams } from "../../@types/navigation";

import { Entypo } from "@expo/vector-icons";

import { Background } from "../../components/background";
import { Heading } from "../../components/Heading";
import { DuoCard, DuoCardProps } from "../../components/DuoCard";
import { DuoMatch } from "../../components/DuoMatch";

import logo from "../../assets/logo-nlw-esports.png";
import { THEME } from "../../theme";

import { styles } from "./styles";

export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discordDuoSelected, setDiscordDuoSelected] = useState("");

  const { goBack } = useNavigation();
  const route = useRoute();
  const game = route.params as GameParams;

  async function getDiscordUser(adsId: string) {
    fetch(`http://192.168.15.17:19000/ads/${adsId}/discord`)
      .then((response) => response.json())
      .then((data) => setDiscordDuoSelected(data.discord));
  }

  useEffect(() => {
    fetch(`http://192.168.15.17:19000/games/${game.id}/ads`)
      .then((response) => response.json())
      .then((data) => setDuos(data));
  }, []);

  console.log(duos);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image source={logo} style={styles.logo} />
          <View style={styles.right} />
        </View>
        <Image
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
        <Heading title={game.title} subtitle="Conecte-se e comece a jogar" />

        <FlatList
          data={duos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuoCard data={item} onConnect={() => getDiscordUser(item.id)} />
          )}
          horizontal
          style={styles.containerList}
          contentContainerStyle={[
            !duos ? styles.emptyListContent : styles.contentList,
          ]}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyList}>
              Nao ha anuncios publicados para esse jogo ainda
            </Text>
          )}
        />
        <DuoMatch
          visible={discordDuoSelected.length > 0}
          onClose={() => setDiscordDuoSelected("")}
          discord={discordDuoSelected}
        />
      </SafeAreaView>
    </Background>
  );
}
