import type { Book } from "@/types";
import { API_ORIGIN } from "@/services/api.config";

import lordOfTheRingsCover from "@/assets/lordoftherings.jpg";
import orwell1984Cover from "@/assets/1984.jpg";
import toKillAMockingbirdCover from "@/assets/tosol.jpg";
import prideAndPrejudiceCover from "@/assets/orgulhoepreconceito.jpg";
import dunaCover from "@/assets/duna.jpg";
import oneHundredYearsCover from "@/assets/cemanos.jpg";
import gameOfThronesCover from "@/assets/tronos.jpg";
import littlePrinceCover from "@/assets/pequenoprincipe.jpg";
import homemESeusSimbolosCover from "@/assets/homemeseussimbolos.jpg";
import asDoresDoMundoCover from "@/assets/asdoresdomundo.jpg";
import aObscenaSenhoraDCover from "@/assets/aobscenasenhorad.jpg";
import aHoraDaEstrelaCover from "@/assets/ahoradaestrela.jpg";
import delicadoAbismoCover from "@/assets/delicadoabismo.jpg";
import quartoDeDespejoCover from "@/assets/quartodedespejo.jpg";
import diarioDeAnneFrankCover from "@/assets/diariodeannefrank.jpg";

const localImagesMap: Record<string, string> = {
  "/src/assets/lordoftherings.jpg": lordOfTheRingsCover,
  "/src/assets/1984.jpg": orwell1984Cover,
  "/src/assets/tosol.jpg": toKillAMockingbirdCover,
  "/src/assets/orgulhoepreconceito.jpg": prideAndPrejudiceCover,
  "/src/assets/duna.jpg": dunaCover,
  "/src/assets/cemanos.jpg": oneHundredYearsCover,
  "/src/assets/tronos.jpg": gameOfThronesCover,
  "/src/assets/pequenoprincipe.jpg": littlePrinceCover,
  "/src/assets/homemeseussimbolos.jpg": homemESeusSimbolosCover,
  "/src/assets/asdoresdomundo.jpg": asDoresDoMundoCover,
  "/src/assets/aobscenasenhorad.jpg": aObscenaSenhoraDCover,
  "/src/assets/ahoradaestrela.jpg": aHoraDaEstrelaCover,
  "/src/assets/delicadoabismo.jpg": delicadoAbismoCover,
  "/src/assets/quartodedespejo.jpg": quartoDeDespejoCover,
  "/src/assets/diariodeannefrank.jpg": diarioDeAnneFrankCover,
};

export const getImageUrl = (book?: Partial<Book>): string => {
  if (!book) {
    return "https://placehold.co/200x300/5d21d1/ffffff?text=Sem+Capa";
  }

  const imageUrlCandidate =
    book.cover_url || book.full_cover_url || "";

  // =========================
  // IMAGEM LOCAL DO MOCK
  // =========================
  const localImage = localImagesMap[imageUrlCandidate];

  if (localImage) {
    return localImage;
  }

  // =========================
  // URL EXTERNA
  // =========================
  if (
    imageUrlCandidate.startsWith("http://") ||
    imageUrlCandidate.startsWith("https://")
  ) {
    return imageUrlCandidate;
  }

  // =========================
  // REMOVE /assets/
  // REMOVE HASH -CTb483ej
  // =========================
  const cleanFileName = imageUrlCandidate
    .replace("/assets/", "")
    .replace(/^assets\//, "")
    .replace(/-[A-Za-z0-9]+(?=\.(jpg|jpeg|png|webp))/i, "");

  // =========================
  // URL FINAL DO BACKEND
  // =========================
  return `${API_ORIGIN}/files/${cleanFileName}`;
};