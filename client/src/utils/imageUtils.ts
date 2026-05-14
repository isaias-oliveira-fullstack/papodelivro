import type { Book } from '@/types';

import lordOfTheRingsCover from '@/assets/lordoftherings.jpg';
import orwell1984Cover from '@/assets/1984.jpg';
import toKillAMockingbirdCover from '@/assets/tosol.jpg';
import prideAndPrejudiceCover from '@/assets/orgulhoepreconceito.jpg';
import dunaCover from '@/assets/duna.jpg';
import oneHundredYearsCover from '@/assets/cemanos.jpg';
import gameOfThronesCover from '@/assets/tronos.jpg';
import littlePrinceCover from '@/assets/pequenoprincipe.jpg';
import homemESeusSimbolosCover from '@/assets/homemeseussimbolos.jpg';
import asDoresDoMundoCover from '@/assets/asdoresdomundo.jpg';
import aObscenaSenhoraDCover from '@/assets/aobscenasenhorad.jpg';
import aHoraDaEstrelaCover from '@/assets/ahoradaestrela.jpg';
import delicadoAbismoCover from '@/assets/delicadoabismo.jpg';
import quartoDeDespejoCover from '@/assets/quartodedespejo.jpg';
import diarioDeAnneFrankCover from '@/assets/diariodeannefrank.jpg';

const localImagesMap: Record<string, string> = {
  '/src/assets/lordoftherings.jpg': lordOfTheRingsCover,
  '/src/assets/1984.jpg': orwell1984Cover,
  '/src/assets/tosol.jpg': toKillAMockingbirdCover,
  '/src/assets/orgulhoepreconceito.jpg': prideAndPrejudiceCover,
  '/src/assets/duna.jpg': dunaCover,
  '/src/assets/cemanos.jpg': oneHundredYearsCover,
  '/src/assets/tronos.jpg': gameOfThronesCover,
  '/src/assets/pequenoprincipe.jpg': littlePrinceCover,
  '/src/assets/homemeseussimbolos.jpg': homemESeusSimbolosCover,
  '/src/assets/asdoresdomundo.jpg': asDoresDoMundoCover,
  '/src/assets/aobscenasenhorad.jpg': aObscenaSenhoraDCover,
  '/src/assets/ahoradaestrela.jpg': aHoraDaEstrelaCover,
  '/src/assets/delicadoabismo.jpg': delicadoAbismoCover,
  '/src/assets/quartodedespejo.jpg': quartoDeDespejoCover,
  '/src/assets/diariodeannefrank.jpg': diarioDeAnneFrankCover,
};

export const getImageUrl = (book?: Partial<Book>): string => {
  if (!book || (!book.full_cover_url && !book.cover_url)) {
    return 'https://via.placeholder.com/200x300.png?text=Sem+Capa';
  }

  const imageUrlCandidate = book.cover_url ?? book.full_cover_url;

  if (!imageUrlCandidate) {
    return 'https://via.placeholder.com/200x300.png?text=Sem+Capa';
  }

  if (imageUrlCandidate.startsWith('http://') || imageUrlCandidate.startsWith('https://')) {
    return imageUrlCandidate;
  }

  if (imageUrlCandidate.startsWith('/src/assets/')) {
    const resolved = localImagesMap[imageUrlCandidate];
    if (resolved) return resolved;

    console.warn(`[getImageUrl] Asset local não encontrado no mapa para: ${imageUrlCandidate}`);
  } else {
    const rawApiUrl = import.meta.env.VITE_API_URL ?? '';
    const backendBaseUrl = rawApiUrl.replace(/\/$/, '').replace(/\/api$/, '');
    return `${backendBaseUrl}/files/${imageUrlCandidate}`;
  }

  console.warn('[getImageUrl] Não foi possível resolver a imagem para o objeto:', book);
  return 'https://via.placeholder.com/200x300.png?text=Capa+N%C3%A3o+Encontrada';
};
