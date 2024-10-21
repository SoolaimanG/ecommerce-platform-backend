export const chartColorFills = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
];

export const nigeriaStateData: Record<
  string,
  {
    coordinates: { lat: number; lng: number };
    lgas: Record<string, { lat: number; lng: number }>;
  }
> = {
  Abia: {
    coordinates: { lat: 5.4527, lng: 7.5248 },
    lgas: {
      AbaNorth: { lat: 5.348, lng: 7.3687 },
      AbaSouth: { lat: 5.1032, lng: 7.3677 },
      Umuahia: { lat: 5.532, lng: 7.486 },
    },
  },
  Adamawa: {
    coordinates: { lat: 9.3265, lng: 12.3984 },
    lgas: {
      YolaNorth: { lat: 9.2035, lng: 12.4951 },
      YolaSouth: { lat: 9.1275, lng: 12.4322 },
      Mubi: { lat: 10.2679, lng: 13.28 },
    },
  },
  AkwaIbom: {
    coordinates: { lat: 5.0473, lng: 7.9266 },
    lgas: {
      Uyo: { lat: 5.0283, lng: 7.9273 },
      IkotEkpene: { lat: 5.1814, lng: 7.7157 },
      Eket: { lat: 4.6413, lng: 7.9241 },
    },
  },
  Anambra: {
    coordinates: { lat: 6.2209, lng: 7.0676 },
    lgas: {
      Awka: { lat: 6.2107, lng: 7.0694 },
      Onitsha: { lat: 6.1667, lng: 6.7833 },
      Nnewi: { lat: 6.0105, lng: 6.9126 },
    },
  },
  Bauchi: {
    coordinates: { lat: 10.3142, lng: 9.8463 },
    lgas: {
      Bauchi: { lat: 10.3142, lng: 9.8463 },
      Misau: { lat: 11.3133, lng: 9.3526 },
      Azare: { lat: 11.6789, lng: 10.1912 },
    },
  },
  Bayelsa: {
    coordinates: { lat: 4.7719, lng: 6.0699 },
    lgas: {
      Yenagoa: { lat: 4.9247, lng: 6.2766 },
      Sagbama: { lat: 5.0235, lng: 5.9209 },
      Ogbia: { lat: 4.7892, lng: 6.2753 },
    },
  },
  Benue: {
    coordinates: { lat: 7.3376, lng: 8.74 },
    lgas: {
      Makurdi: { lat: 7.7306, lng: 8.5409 },
      Otukpo: { lat: 7.1991, lng: 8.128 },
      Gboko: { lat: 7.3235, lng: 9.0025 },
    },
  },
  Borno: {
    coordinates: { lat: 11.8333, lng: 13.15 },
    lgas: {
      Maiduguri: { lat: 11.8333, lng: 13.15 },
      Biu: { lat: 10.6111, lng: 12.1936 },
      Konduga: { lat: 11.6656, lng: 13.4181 },
    },
  },
  CrossRiver: {
    coordinates: { lat: 5.9631, lng: 8.3345 },
    lgas: {
      CalabarMunicipal: { lat: 4.9589, lng: 8.3269 },
      Odukpani: { lat: 5.0989, lng: 8.2843 },
      Obudu: { lat: 6.6674, lng: 9.1652 },
    },
  },
  Delta: {
    coordinates: { lat: 5.8904, lng: 5.6836 },
    lgas: {
      Asaba: { lat: 6.2099, lng: 6.6959 },
      Warri: { lat: 5.5544, lng: 5.7932 },
      Sapele: { lat: 5.8941, lng: 5.6767 },
    },
  },
  Ebonyi: {
    coordinates: { lat: 6.2649, lng: 8.013 },
    lgas: {
      Abakaliki: { lat: 6.3249, lng: 8.1137 },
      Afikpo: { lat: 5.8965, lng: 7.9376 },
      Ezza: { lat: 6.2085, lng: 8.0741 },
    },
  },
  Edo: {
    coordinates: { lat: 6.5244, lng: 5.8987 },
    lgas: {
      BeninCity: { lat: 6.3382, lng: 5.6226 },
      Auchi: { lat: 7.0676, lng: 6.2639 },
      Ekpoma: { lat: 6.7483, lng: 6.1396 },
    },
  },
  Ekiti: {
    coordinates: { lat: 7.6217, lng: 5.2194 },
    lgas: {
      AdoEkiti: { lat: 7.6177, lng: 5.2305 },
      IkereEkiti: { lat: 7.4971, lng: 5.2393 },
      OyeEkiti: { lat: 7.7942, lng: 5.3317 },
    },
  },
  Enugu: {
    coordinates: { lat: 6.5246, lng: 7.5096 },
    lgas: {
      EnuguNorth: { lat: 6.5417, lng: 7.3945 },
      Nsukka: { lat: 6.8563, lng: 7.3958 },
      Udi: { lat: 6.3229, lng: 7.3435 },
    },
  },
  Gombe: {
    coordinates: { lat: 10.2897, lng: 11.1727 },
    lgas: {
      Gombe: { lat: 10.2905, lng: 11.1751 },
      Kaltungo: { lat: 9.8184, lng: 11.3063 },
      Billiri: { lat: 9.8573, lng: 11.2166 },
    },
  },
  Imo: {
    coordinates: { lat: 5.484, lng: 7.035 },
    lgas: {
      Owerri: { lat: 5.4837, lng: 7.0356 },
      Orlu: { lat: 5.796, lng: 7.0311 },
      Okigwe: { lat: 5.8346, lng: 7.3527 },
    },
  },
  Jigawa: {
    coordinates: { lat: 12.2286, lng: 9.5616 },
    lgas: {
      Dutse: { lat: 11.7599, lng: 9.3482 },
      Gumel: { lat: 12.6263, lng: 9.3877 },
      Hadejia: { lat: 12.457, lng: 10.0431 },
    },
  },
  Kaduna: {
    coordinates: { lat: 10.5105, lng: 7.4165 },
    lgas: {
      KadunaNorth: { lat: 10.5268, lng: 7.4388 },
      Zaria: { lat: 11.0736, lng: 7.6955 },
      Kafanchan: { lat: 9.575, lng: 8.2932 },
    },
  },
  Kano: {
    coordinates: { lat: 12.0022, lng: 8.592 },
    lgas: {
      KanoMunicipal: { lat: 12.0022, lng: 8.592 },
      Nassarawa: { lat: 11.9572, lng: 8.5443 },
      Tarauni: { lat: 11.9974, lng: 8.5458 },
    },
  },
  Katsina: {
    coordinates: { lat: 12.9885, lng: 7.6223 },
    lgas: {
      Katsina: { lat: 12.9904, lng: 7.6014 },
      Daura: { lat: 13.0345, lng: 8.322 },
      Funtua: { lat: 11.5282, lng: 7.3084 },
    },
  },
  Kebbi: {
    coordinates: { lat: 12.4539, lng: 4.1974 },
    lgas: {
      BirninKebbi: { lat: 12.4539, lng: 4.1974 },
      Argungu: { lat: 12.7462, lng: 4.5146 },
      Zuru: { lat: 11.4311, lng: 5.2337 },
    },
  },
  Kogi: {
    coordinates: { lat: 7.7337, lng: 6.6906 },
    lgas: {
      Lokoja: { lat: 7.8023, lng: 6.7437 },
      Kabba: { lat: 7.8159, lng: 6.0734 },
      Idah: { lat: 7.11, lng: 6.7346 },
    },
  },
  Kwara: {
    coordinates: { lat: 8.4905, lng: 4.548 },
    lgas: {
      Ilorin: { lat: 8.4966, lng: 4.5483 },
      Offa: { lat: 8.1488, lng: 4.7201 },
      Jebba: { lat: 9.1266, lng: 4.8209 },
    },
  },
  Lagos: {
    coordinates: { lat: 6.5244, lng: 3.3792 },
    lgas: {
      Ikeja: { lat: 6.6018, lng: 3.3515 },
      Lekki: { lat: 6.4698, lng: 3.5852 },
      Surulere: { lat: 6.5015, lng: 3.3515 },
    },
  },
  Nasarawa: {
    coordinates: { lat: 8.5153, lng: 8.3715 },
    lgas: {
      Lafia: { lat: 8.4902, lng: 8.5158 },
      Keffi: { lat: 8.8494, lng: 7.8734 },
      Akwanga: { lat: 8.9121, lng: 8.4127 },
    },
  },
  Niger: {
    coordinates: { lat: 9.9312, lng: 5.5983 },
    lgas: {
      Minna: { lat: 9.6218, lng: 6.5569 },
      Suleja: { lat: 9.1807, lng: 7.1795 },
      Kontagora: { lat: 10.3992, lng: 5.4699 },
    },
  },
  Ogun: {
    coordinates: { lat: 7.16, lng: 3.35 },
    lgas: {
      Abeokuta: { lat: 7.16, lng: 3.35 },
      IjebuOde: { lat: 6.8189, lng: 3.9173 },
      Sagamu: { lat: 6.8444, lng: 3.646 },
    },
  },
  Ondo: {
    coordinates: { lat: 7.2508, lng: 5.2103 },
    lgas: {
      Akure: { lat: 7.2508, lng: 5.2103 },
      Owo: { lat: 7.206, lng: 5.5877 },
      OndoTown: { lat: 7.0932, lng: 4.8341 },
    },
  },
  Osun: {
    coordinates: { lat: 7.6298, lng: 4.187 },
    lgas: {
      Osogbo: { lat: 7.6298, lng: 4.187 },
      Ife: { lat: 7.4667, lng: 4.5667 },
      Ilesha: { lat: 7.6279, lng: 4.7416 },
    },
  },
  Oyo: {
    coordinates: { lat: 7.3775, lng: 3.947 },
    lgas: {
      Ibadan: { lat: 7.3775, lng: 3.947 },
      Ogbomosho: { lat: 8.1339, lng: 4.2436 },
      Iseyin: { lat: 7.9692, lng: 3.5962 },
    },
  },
  Plateau: {
    coordinates: { lat: 9.2182, lng: 9.5172 },
    lgas: {
      Jos: { lat: 9.9285, lng: 8.8921 },
      Pankshin: { lat: 9.3322, lng: 9.4302 },
      Shendam: { lat: 8.8834, lng: 9.5355 },
    },
  },
  Rivers: {
    coordinates: { lat: 4.8156, lng: 7.0498 },
    lgas: {
      PortHarcourt: { lat: 4.8156, lng: 7.0498 },
      ObioAkpor: { lat: 4.857, lng: 7.0107 },
      Eleme: { lat: 4.7863, lng: 7.1393 },
    },
  },
  Sokoto: {
    coordinates: { lat: 13.0645, lng: 5.2414 },
    lgas: {
      SokotoNorth: { lat: 13.0673, lng: 5.2347 },
      SokotoSouth: { lat: 13.0332, lng: 5.2436 },
      Wamako: { lat: 13.0654, lng: 5.1542 },
    },
  },
  Taraba: {
    coordinates: { lat: 8.8876, lng: 11.366 },
    lgas: {
      Jalingo: { lat: 8.9006, lng: 11.3602 },
      Wukari: { lat: 7.8762, lng: 9.7802 },
      Bali: { lat: 8.3589, lng: 10.9967 },
    },
  },
  Yobe: {
    coordinates: { lat: 11.7463, lng: 11.9666 },
    lgas: {
      Damaturu: { lat: 11.7463, lng: 11.9666 },
      Potiskum: { lat: 11.7072, lng: 11.0737 },
      Nguru: { lat: 12.879, lng: 10.4516 },
    },
  },
  Zamfara: {
    coordinates: { lat: 12.1667, lng: 6.25 },
    lgas: {
      Gusau: { lat: 12.1704, lng: 6.6649 },
      KauraNamoda: { lat: 12.5882, lng: 6.5805 },
      TalataMafara: { lat: 12.5707, lng: 6.0617 },
    },
  },
};
