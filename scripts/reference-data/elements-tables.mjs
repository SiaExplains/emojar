// Hand-checked tables merged into the PubChem data (see elements.mjs).

/** Discoverer, or first to isolate/recognise the element. */
export const DISCOVERER = Object.fromEntries(
  `H|Henry Cavendish
He|Pierre Janssen, Norman Lockyer
Li|Johan August Arfwedson
Be|Louis-Nicolas Vauquelin
B|Joseph Louis Gay-Lussac, Louis Jacques Thénard, Humphry Davy
C|Known since antiquity
N|Daniel Rutherford
O|Carl Wilhelm Scheele, Joseph Priestley
F|Henri Moissan
Ne|William Ramsay, Morris Travers
Na|Humphry Davy
Mg|Joseph Black
Al|Hans Christian Ørsted
Si|Jöns Jacob Berzelius
P|Hennig Brand
S|Known since antiquity
Cl|Carl Wilhelm Scheele
Ar|Lord Rayleigh, William Ramsay
K|Humphry Davy
Ca|Humphry Davy
Sc|Lars Fredrik Nilson
Ti|William Gregor
V|Andrés Manuel del Río
Cr|Louis-Nicolas Vauquelin
Mn|Johan Gottlieb Gahn
Fe|Known since antiquity
Co|Georg Brandt
Ni|Axel Fredrik Cronstedt
Cu|Known since antiquity
Zn|Andreas Sigismund Marggraf
Ga|Paul-Émile Lecoq de Boisbaudran
Ge|Clemens Winkler
As|Albertus Magnus
Se|Jöns Jacob Berzelius
Br|Antoine Jérôme Balard, Carl Jacob Löwig
Kr|William Ramsay, Morris Travers
Rb|Robert Bunsen, Gustav Kirchhoff
Sr|Adair Crawford
Y|Johan Gadolin
Zr|Martin Heinrich Klaproth
Nb|Charles Hatchett
Mo|Carl Wilhelm Scheele
Tc|Emilio Segrè, Carlo Perrier
Ru|Karl Ernst Claus
Rh|William Hyde Wollaston
Pd|William Hyde Wollaston
Ag|Known since antiquity
Cd|Friedrich Stromeyer
In|Ferdinand Reich, Hieronymous Theodor Richter
Sn|Known since antiquity
Sb|Known since antiquity
Te|Franz-Joseph Müller von Reichenstein
I|Bernard Courtois
Xe|William Ramsay, Morris Travers
Cs|Robert Bunsen, Gustav Kirchhoff
Ba|Carl Wilhelm Scheele
La|Carl Gustaf Mosander
Ce|Jöns Jacob Berzelius, Wilhelm Hisinger, Martin Heinrich Klaproth
Pr|Carl Auer von Welsbach
Nd|Carl Auer von Welsbach
Pm|Jacob A. Marinsky, Lawrence E. Glendenin, Charles D. Coryell
Sm|Paul-Émile Lecoq de Boisbaudran
Eu|Eugène-Anatole Demarçay
Gd|Jean Charles Galissard de Marignac
Tb|Carl Gustaf Mosander
Dy|Paul-Émile Lecoq de Boisbaudran
Ho|Marc Delafontaine, Jacques-Louis Soret, Per Teodor Cleve
Er|Carl Gustaf Mosander
Tm|Per Teodor Cleve
Yb|Jean Charles Galissard de Marignac
Lu|Georges Urbain, Carl Auer von Welsbach
Hf|Dirk Coster, George de Hevesy
Ta|Anders Gustaf Ekeberg
W|Juan José Elhuyar, Fausto Elhuyar
Re|Walter Noddack, Ida Noddack, Otto Berg
Os|Smithson Tennant
Ir|Smithson Tennant
Pt|Antonio de Ulloa
Au|Known since antiquity
Hg|Known since antiquity
Tl|William Crookes
Pb|Known since antiquity
Bi|Claude François Geoffroy
Po|Marie Curie, Pierre Curie
At|Dale R. Corson, Kenneth Ross MacKenzie, Emilio Segrè
Rn|Friedrich Ernst Dorn
Fr|Marguerite Perey
Ra|Marie Curie, Pierre Curie
Ac|André-Louis Debierne
Th|Jöns Jacob Berzelius
Pa|Kasimir Fajans, Oswald Helmuth Göhring
U|Martin Heinrich Klaproth
Np|Edwin McMillan, Philip H. Abelson
Pu|Glenn T. Seaborg and colleagues
Am|Glenn T. Seaborg and colleagues
Cm|Glenn T. Seaborg, Ralph A. James, Albert Ghiorso
Bk|Glenn T. Seaborg, Albert Ghiorso, Stanley G. Thompson
Cf|Stanley G. Thompson, Kenneth Street Jr., Albert Ghiorso, Glenn T. Seaborg
Es|Albert Ghiorso and colleagues
Fm|Albert Ghiorso and colleagues
Md|Albert Ghiorso, Glenn T. Seaborg and colleagues
No|Joint Institute for Nuclear Research (Dubna)
Lr|Albert Ghiorso and colleagues (Berkeley)
Rf|Joint Institute for Nuclear Research (Dubna) / Berkeley
Db|Joint Institute for Nuclear Research (Dubna) / Berkeley
Sg|Albert Ghiorso and colleagues (Berkeley)
Bh|GSI Helmholtz Centre (Darmstadt)
Hs|GSI Helmholtz Centre (Darmstadt)
Mt|GSI Helmholtz Centre (Darmstadt)
Ds|GSI Helmholtz Centre (Darmstadt)
Rg|GSI Helmholtz Centre (Darmstadt)
Cn|GSI Helmholtz Centre (Darmstadt)
Nh|RIKEN (Japan)
Fl|Joint Institute for Nuclear Research (Dubna) / LLNL
Mc|Joint Institute for Nuclear Research (Dubna) / LLNL / ORNL
Lv|Joint Institute for Nuclear Research (Dubna) / LLNL
Ts|Joint Institute for Nuclear Research (Dubna) / ORNL / LLNL
Og|Joint Institute for Nuclear Research (Dubna) / LLNL`
    .split('\n')
    .map((l) => l.split('|')),
);

/** IUPAC/CIAAW standard atomic weights (conventional values). */
export const STANDARD_WEIGHT = Object.fromEntries(
  'H 1.008|He 4.002602|Li 6.94|Be 9.0121831|B 10.81|C 12.011|N 14.007|O 15.999|F 18.998403162|Ne 20.1797|Na 22.98976928|Mg 24.305|Al 26.9815384|Si 28.085|P 30.973761998|S 32.06|Cl 35.45|Ar 39.95|K 39.0983|Ca 40.078|Sc 44.955907|Ti 47.867|V 50.9415|Cr 51.9961|Mn 54.938043|Fe 55.845|Co 58.933194|Ni 58.6934|Cu 63.546|Zn 65.38|Ga 69.723|Ge 72.630|As 74.921595|Se 78.971|Br 79.904|Kr 83.798|Rb 85.4678|Sr 87.62|Y 88.905838|Zr 91.222|Nb 92.90637|Mo 95.95|Ru 101.07|Rh 102.90549|Pd 106.42|Ag 107.8682|Cd 112.414|In 114.818|Sn 118.710|Sb 121.760|Te 127.60|I 126.90447|Xe 131.293|Cs 132.90545196|Ba 137.327|La 138.90547|Ce 140.116|Pr 140.90766|Nd 144.242|Sm 150.36|Eu 151.964|Gd 157.249|Tb 158.925354|Dy 162.500|Ho 164.930329|Er 167.259|Tm 168.934219|Yb 173.045|Lu 174.96669|Hf 178.486|Ta 180.94788|W 183.84|Re 186.207|Os 190.23|Ir 192.217|Pt 195.084|Au 196.966570|Hg 200.592|Tl 204.38|Pb 207.2|Bi 208.98040|Th 232.0377|Pa 231.03588|U 238.02891'
    .split('|')
    .map((x) => x.split(' '))
    .map(([s, w]) => [s, Number(w)]),
);

/** Mass number of the longest-lived isotope, for elements without a standard weight. */
export const MASS_NUMBER = {
  Tc: 97,
  Pm: 145,
  Po: 209,
  At: 210,
  Rn: 222,
  Fr: 223,
  Ra: 226,
  Ac: 227,
  Np: 237,
  Pu: 244,
  Am: 243,
  Cm: 247,
  Bk: 247,
  Cf: 251,
  Es: 252,
  Fm: 257,
  Md: 258,
  No: 259,
  Lr: 266,
  Rf: 267,
  Db: 268,
  Sg: 269,
  Bh: 270,
  Hs: 269,
  Mt: 278,
  Ds: 281,
  Rg: 282,
  Cn: 285,
  Nh: 286,
  Fl: 289,
  Mc: 290,
  Lv: 293,
  Ts: 294,
  Og: 294,
};

/**
 * Corrections to PubChem's discovery years (checked against the Wikipedia
 * timeline of element discoveries and the RSC periodic table).
 */
export const YEAR_FIX = {
  Al: '1825',
  Ca: '1808',
  As: 'c. 1250',
  F: '1886',
  Mg: '1755',
  Si: '1823',
  Ru: '1844',
  Ba: '1772',
  Bh: '1981',
  No: '1966',
  Th: '1829',
};
