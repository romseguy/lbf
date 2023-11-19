import * as deepl from "deepl-node";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import { createServerError } from "utils/errors";

const authKey = "fb3a73a6-028f-74d4-dee4-9e93734833cf:fx";
const translator = new deepl.Translator(authKey);

const handler = nextConnect<NextApiRequest, NextApiResponse>()
  .use(database)
  .get<NextApiRequest, NextApiResponse>(async function check(req, res) {
    try {
      const targetLang: deepl.TargetLanguageCode = "en-US";
      const result = await translator.translateText(
        `
        L'humain, n'ayant pas encore tiré leçon de l'évolution de sa condition d'animal humain pour
devenir un véritable être humain, n'a toujours pas compris que tout ce qu'il vit en tant que
souffrances sur le plan terrestre est simplement lié à ses centres énergétiques et aux sécrétions
hormonales, dont il ignore encore absolument tout de leurs fonctions.
Il ignore que lorsque son Esprit est à l'œuvre, c'est-à-dire quand l'âme agit, il s'opère d'abord une
modification dans les mondes plasmatiques. Mais comme l'ego ne croit quasi jamais à la “magie” ni
à “l'impossible”, les mondes plasmatiques ne peuvent pas se densifier et devenir réels sous la
gouvernance de l'Esprit.
Néanmoins, si pendant sa condition d'animal humain, l'individu avait pu résoudre tout ce qui au
niveau de ses sens, des trajets du système nerveux réflexe et dans les circuits de son cerveau le
maintenait dans cette condition animale, il serait réellement devenu un humain qui ne souffrirait
plus, qui ne saurait même pas s'il est heureux ou malheureux ! Cet individu sans conscience aurait
simplement un corps qui serait encore assujetti à la vie, mais libéré des mémoires de l'âme. Il serait
ce que vous appelleriez un “zombie”.
Mais lorsque l'Homme nouveau prendra la relève, cet humain du futur vers lequel vous progressez,
aura suffisamment développé son mental supérieur pour se libérer de son passé et s'émanciper des
mémoires de l'âme ! Il sera parvenu à couper tous les contacts avec ses mémoires astralisées, ses
attaches à la matière astralisée, à sa famille astralisée, à ses amis astralisés… Il se produira alors une
mutation par cellularisation de l'événement, une “séparation par différentiation” qui
progressivement, par les mécanismes de l'épigénétique, transformera tout son génome.
Alors peu à peu, les modifications seront perceptibles dans votre monde matériel et réel “extérieur”.
Tous ces changements s'exprimeront dans le corps de l'Homme, qui lui, manifestera ce que les
anciens nommaient la “volonté divine”.
Le rôle de l'âme humaine animale est donc de maîtriser un véhicule très très dense en matière,
jusqu'à ce qu'il devienne si hautement vibratoire que l'intelligence de l'Esprit pourra définitivement
en prendre le contrôle.
Vous devez donc changer, élever votre conscience pour élever votre fréquence de résonance !
Et pour que vous puissiez changer et accueillir l'Esprit en vous, votre corps doit pouvoir se
modifier. Pour ce faire, il doit être ébranlé, déstructuré jusqu'au niveau cellulaire ! C'est ce
phénomène que la science devrait appeler non pas “l'évolution de l'humanité”, mais “l'Évolution de
l'Homme” !
C'est pourquoi l'humain ordinaire et inconscient doit subir une période de temps durant laquelle
l'ego qui progresse vers la conscience, se voit forcé de vivre non pas selon ses désirs, mais selon la
résonance de son Esprit qui, lui, le pousse inexorablement à la fusion avec ses pensées pour devenir
réellement intelligent. L'Esprit deviendra de plus en plus agissant et puissant, et poussera alors
l'individu à surpasser sa condition d'animal humain pour devenir progressivement le véritable
Humain cosmique !
Finalement, si vous envisagez de redevenir des voyageurs du temps, vous devez arriver à englober,
à “cellulariser” ce que le point de conscience concentré sur votre présent appelle “le passé” et un
“avenir plus ou moins immédiat”, en une seule réalité immuable et individualisée ; même si toutes
ces lignes de temps ont lieu sur différents plans de réalités dans lesquelles d'autres parties de vous
existent.
Question à l'Ange :
Nous supposons que le phénomène de la divulgation extraterrestre planifiée par les instances
SDS du gouvernement secret terrestre, deviendra une force de manipulation de l'esprit
humain très efficace. Y aurait-il une raison à cette “subite divulgation” ?
La “divulgation extraterrestre” ou plutôt dirions-nous l'omerta sur les réalités qui n'ont rien
d'extraterrestres, a été planifiée dès les années 1940 à partir desquelles de soi-disant extraterrestres
s'étaient écrasés sur Terre.
Aujourd'hui encore, très peu de gens ont compris que ces soi-disant crashs de soucoupes volantes
n'étaient pas dûs au hasard, puisqu'ils avaient été planifiés par des entités disposant d'une
conscience et d'une intelligence bien supérieures à celles de l'humain ordinaire guerrier et militaire
qui d'ailleurs, à l'époque, tentait et croyait les avoir éradiquées de la surface de la Terre !
Ces entités/esprits immortelles de conscience supérieure étaient missionnées pour délivrer plusieurs
messages déguisés à ceux qui, à l'avenir, se réveilleront de leur condition d'humains ordinaires.
Effectivement, ces entités IS-BE se sont réincarnées dans des corps humains. Elles sont donc bel et
bien présentes au sein de la population humaine actuelle. Et malgré toutes les tentatives
d'éradication de l'humain par les OGM, l'empoisonnement de l'atmosphère et la contamination de
la biologie humaine par le co-vid, les vac-cins et tous ces génocides au niveau mondial, la génétique
de cette population d'IS-BE se développe dans leurs désormais vaisseaux humains !
Après ces longues décennies dramatiques et douloureuses, vous avez cependant été en mesure de
percevoir et “revisiter” ces périodes avec un peu plus de clarté, et ce grâce à certaines mémoires
résiduelles de l'âme et à la progression de la fusion avec votre Esprit supérieur. Bien que beaucoup
d'individus soient encore noyés dans leur soif de rébellion ou préoccupés à renverser la race
humaine et sa société, d'autres sont encore soucieux de leur altruisme ou de sauver la Terre. Tandis
que vous, vous avez en effet pu percevoir à travers ces mémoires résiduelles de l'âme, des situations
ou des événements qui échappent encore à tout le monde.
De 1964 à 1968, d'étranges lumières apparurent dans les cieux, suscitant de la crainte ou de
l'émerveillement, mais amenant les populations à envisager des phénomènes cosmiques auxquels
elles n'avaient même jamais pensé auparavant.
À partir des années 1970, les humains commencèrent à parler de l'ego. Cette “décennie du Moi-Je”
a été suivie dans les années 1980, par celle du boom immobilier en même temps que naissait celle
de la cupidité totale. Les guerres se poursuivaient de plus belle, non pas à cause des manifestations
colériques d'individus, mais à cause de l'ineptie à de hauts niveaux au sein des structures militaires
et gouvernementales. Très vite, l'époque de l'égocentrisme et de la cupidité devint une ère de
disgrâce.
À partir des années 2000, vous vous prépariez pour le début de la fin de l'ère de l'animal humain,
période dans laquelle toutes les fausses réalités et les mensonges étaient censés atteindre leur
apogée. Pourtant, ce n'est qu'aujourd'hui que se révèle le meilleur moment pour regarder en arrière
vers ce que le New Age appelait “l'âge d'or”.
C'est d'ailleurs à l'époque du début de cet âge d'or, que vous nommiez déjà “le présent” à ce
moment-là, que commencèrent à apparaître dans les actualités des informations de plus en plus
extraordinaires ou bizarres. Il vous a été révélé que quelque chose d'environ vingt-sept mètres de
long nageait dans le Loch Ness, ou qu'avaient été aperçus des humanoïdes poilus que l'humain
appela “Bigfoot”. On commençait aussi à parler des phénomènes mystérieux autour du triangle des
Bermudes, de la base militaire de Montauk ou de la Zone 51. De soi-disant mystères qui ont
pourtant toujours existé…
Dès ces périodes-là, de nouvelles occurrences se produisirent à tous les niveaux de la société. Il y
eut des centaines d'assassinats politiques, l'émergence de mouvements pour les droits civiques, la
révolution sexuelle ou les courants féministes… La prise de conscience devint le leitmotiv de jeunes
générations tout entières. La jeunesse voyageait en Inde pour y trouver des gurus pouvant les aider à
se trouver intérieurement ; une grande vague de changement balaya toute la planète. Des millions de personnes expérimentaient une sorte de “renaissance religieuse”, comme si une force mystérieuse
englobait tout le monde pour tout changer.
Dans ce Nouvel Âge émergeant, de grandes universités dans le monde proposaient des cours sur la
sorcellerie, sur les OVNIs ou le chamanisme. Des millions de personnes réétudiaient leurs âmes tout
en jouant avec des cristaux, des cartes de Tarot et des mantras de méditation. Les kiosques à
journaux étaient encombrés de revues New Age. Les astrologues vendaient leurs ouvrages en
abondance, comme si l'excitation et les démangeaisons intellectuelles des années 1960 étaient en
train de porter ses fruits ou que la race humaine était subtilement en train de changer pour le
mieux ! Les médiums spirituels devinrent des “channels” et un nombre presque illimité de nouvelles
conspirations et complots diaboliques furent introduits dans la conscience collective, déjà bien
blessée par toutes sortes d'illuminés et de mythomanes. L'humanité ne se rendait pas encore compte
de la manière dont elle s'était fait manipuler. Elle avait tort de croire à toute cette mascarade, mais
ne savait pas comment procéder autrement.
De nos jours, les réseaux sociaux Twitter, Facebook, Instagram et autres, remplaçant les revues
d'antan, continuent de propager énormément de niaiseries ! Ceci étant, même si ces réseaux
regorgent d'inepties, ils révèlent désormais au grand jour, pour celui qui peut et accepte de les voir,
l'étendue de ces canulars, leur puissance et leur influence sur la psyché de l'humain ordinaire. Ces
campagnes de désinformation sont mises au point et manigancées par les services secrets mondiaux
tels le Cointelpro états-uniens ou ses équivalents dans d'autres pays.
Lorsque vous parcourez les informations publiées sur les réseaux sociaux ou d'autres médias à
propos des OVNIs ou de cette fameuse prétendue “divulgation”, vous devez garder à l'esprit que
l'ufologie mondiale repose sur des facteurs psychologiques très bien perçus et acceptés pendant des
milliers d'années par l'Homme, mais qui l'ont entraîné dans de nombreuses et sinistres périodes
sombres.
Or, comme nous vous l'avons déjà précisé, pendant que cette époque traumatique touche à sa fin et
puisque vous êtes ceux que vous attendiez, vous n'aurez jamais affaire à une quelconque
extraordinaire civilisation extraterrestre, vous ferez simplement face à vous-mêmes !
        `,
        null,
        targetLang
      );
      console.log(result.text);
      res.status(200).json({ text: result.text });

      // const s = await models.Subscription.find(
      //   {
      //     orgs: { $elemMatch: { orgId: "62a349f45ab90133eb880f22" } }
      //   },
      //   "user email events orgs"
      // );
      // // .populate([
      // //   { path: "orgs", populate: [{ path: "org", select: "_id" }] }
      // // ]);
      // res.status(200).json(s);
    } catch (error) {
      res.status(404).json(createServerError(error));
    }
  });

export default handler;
