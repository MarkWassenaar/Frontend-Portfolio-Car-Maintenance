import "car-makes-icons/dist/style.css";
import { CarIcon } from "lucide-react";

import acura from "./svgs/acura.svg";
import alfaRomeo from "./svgs/alfa romeo.svg";
import amGeneral from "./svgs/am general.svg";
import astonMartin from "./svgs/aston martin.svg";
import audi from "./svgs/audi.svg";
import bentley from "./svgs/bentley.svg";
import bmw from "./svgs/bmw.svg";
import bugatti from "./svgs/bugatti.svg";
import buick from "./svgs/buick.svg";
import cadillac from "./svgs/cadillac.svg";
import chevrolet from "./svgs/chevrolet.svg";
import chrysler from "./svgs/chrysler.svg";
import citroen from "./svgs/citroen.svg";
import dacia from "./svgs/dacia.svg";
import daewoo from "./svgs/daewoo.svg";
import dodge from "./svgs/dodge.svg";
import eagle from "./svgs/eagle.svg";
import ferrari from "./svgs/ferrari.svg";
import fiat from "./svgs/fiat.svg";
import fisker from "./svgs/fisker.svg";
import ford from "./svgs/ford.svg";
import genesis from "./svgs/genesis.svg";
import geo from "./svgs/geo.svg";
import gmc from "./svgs/gmc.svg";
import honda from "./svgs/honda.svg";
import hummer from "./svgs/hummer.svg";
import hyundai from "./svgs/hyundai.svg";
import infiniti from "./svgs/infiniti.svg";
import isuzu from "./svgs/isuzu.svg";
import jaguar from "./svgs/jaguar.svg";
import jeep from "./svgs/jeep.svg";
import kia from "./svgs/kia.svg";
import lamborghini from "./svgs/lamborghini.svg";
import landRover from "./svgs/land rover.svg";
import lexus from "./svgs/lexus.svg";
import lincoln from "./svgs/lincoln.svg";
import lotus from "./svgs/lotus.svg";
import maserati from "./svgs/maserati.svg";
import maybach from "./svgs/maybach.svg";
import mazda from "./svgs/mazda.svg";
import mclaren from "./svgs/mclaren.svg";
import mercedesBenz from "./svgs/mercedes benz.svg";
import mercury from "./svgs/mercury.svg";
import mini from "./svgs/mini.svg";
import mitsubishi from "./svgs/mitsubishi.svg";
import nissan from "./svgs/nissan.svg";
import oldsmobile from "./svgs/oldsmobile.svg";
import opel from "./svgs/opel.svg";
import panoz from "./svgs/panoz.svg";
import peugeot from "./svgs/peugeot.svg";
import plymouth from "./svgs/plymouth.svg";
import pontiac from "./svgs/pontiac.svg";
import porsche from "./svgs/porsche.svg";
import ram from "./svgs/ram.svg";
import renault from "./svgs/renault.svg";
import rollsRoyce from "./svgs/rolls royce.svg";
import saab from "./svgs/saab.svg";
import saturn from "./svgs/saturn.svg";
import scion from "./svgs/scion.svg";
import seat from "./svgs/seat.svg";
import skoda from "./svgs/skoda.svg";
import smart from "./svgs/smart.svg";
import spyker from "./svgs/spyker.svg";
import subaru from "./svgs/subaru.svg";
import suzuki from "./svgs/suzuki.svg";
import tesla from "./svgs/tesla.svg";
import toyota from "./svgs/toyota.svg";
import volkswagen from "./svgs/volkswagen.svg";
import volvo from "./svgs/volvo.svg";
import Image from "next/image";

const CarMakeIcon = (props: { make: string }) => {
  console.log("Car make:", props.make);
  const mapping: { [key: string]: string } = {
    acura: acura,
    "alfa-romeo": alfaRomeo,
    "am-general": amGeneral,
    "aston-martin": astonMartin,
    audi: audi,
    bentley: bentley,
    bmw: bmw,
    bugatti: bugatti,
    buick: buick,
    cadillac: cadillac,
    chevrolet: chevrolet,
    chrysler: chrysler,
    citroen: citroen,
    dacia: dacia,
    daewoo: daewoo,
    dodge: dodge,
    eagle: eagle,
    ferrari: ferrari,
    fiat: fiat,
    fisker: fisker,
    ford: ford,
    genesis: genesis,
    geo: geo,
    gmc: gmc,
    honda: honda,
    hummer: hummer,
    hyundai: hyundai,
    infiniti: infiniti,
    isuzu: isuzu,
    jaguar: jaguar,
    jeep: jeep,
    kia: kia,
    lamborghini: lamborghini,
    "land-rover": landRover,
    lexus: lexus,
    lincoln: lincoln,
    lotus: lotus,
    maserati: maserati,
    maybach: maybach,
    mazda: mazda,
    mclaren: mclaren,
    "mercedes-benz": mercedesBenz,
    mercury: mercury,
    mini: mini,
    mitsubishi: mitsubishi,
    nissan: nissan,
    oldsmobile: oldsmobile,
    opel: opel,
    panoz: panoz,
    peugeot: peugeot,
    plymouth: plymouth,
    pontiac: pontiac,
    porsche: porsche,
    ram: ram,
    renault: renault,
    "rolls-royce": rollsRoyce,
    saab: saab,
    saturn: saturn,
    scion: scion,
    seat: seat,
    skoda: skoda,
    smart: smart,
    spyker: spyker,
    subaru: subaru,
    suzuki: suzuki,
    tesla: tesla,
    toyota: toyota,
    volkswagen: volkswagen,
    volvo: volvo,
  };

  const makeFound = mapping[props.make.toLowerCase()];

  if (makeFound === undefined) return <CarIcon />;
  else return <Image src={makeFound} alt="car icon" className={`w-12`} />;
};

export default CarMakeIcon;
