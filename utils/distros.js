import getRandom from '../helpers/getRandom.js';

const linuxShells = ['bash', 'zsh', 'fish', 'ksh', 'sh'];
const macShells = linuxShells;
const windowsShells = ['cmd', 'powershell'];

const distroDetails = {
  discord: {
    packageManager: 'discpkg',
    os: 'Discord Not-GNU/Unlinux',
    shells: linuxShells,
    color: 'blue',
  },
  arch: {
    packageManager: 'pacman',
    os: 'Arch Linux GNU/Linux',
    shells: linuxShells,
    color: 'blue',
  },
  fedora: {
    packageManager: 'dnf',
    os: 'Fedora GNU/Linux',
    shells: linuxShells,
    color: 'cyan',
  },
  manjaro: {
    packageManager: 'yaourt',
    os: 'Manjaro GNU/Linux',
    shells: linuxShells,
    color: 'green',
  },
  mint: {
    packageManager: 'apt',
    os: 'Linux Mint GNU/Linux',
    shells: linuxShells,
    color: 'green',
  },
  popos: {
    packageManager: 'apt',
    os: 'Pop!_OS GNU/Linux',
    shells: linuxShells,
    color: 'cyan',
  },
  ubuntu: {
    packageManager: 'apt',
    os: 'Ubuntu GNU/Linux',
    shells: linuxShells,
    color: 'yellow',
  },
  android: {
    packageManager: 'apt',
    os: 'Android GNU/Linux',
    shells: linuxShells,
    color: 'green',
  },
  centos: {
    packageManager: 'yum',
    os: 'CentOS GNU/Linux',
    shells: linuxShells,
    color: 'magenta',
  },
  debian: {
    packageManager: 'apt',
    os: 'Debian GNU/Linux',
    shells: linuxShells,
    color: 'red',
  },
  elementary: {
    packageManager: 'apt',
    os: 'Elementary OS GNU/Linux',
    shells: linuxShells,
    color: 'gray',
  },
  gentoo: {
    packageManager: 'emerge',
    os: 'Gentoo GNU/Linux',
    shells: linuxShells,
    color: 'magenta',
  },
  macos: {
    packageManager: 'brew',
    os: 'macOS',
    shells: macShells,
    color: 'black',
  },
  windows: {
    packageManager: getRandom(['choco', 'scoop']),
    os: 'Windows',
    shells: windowsShells,
    color: 'blue',
  },
};

export default distroDetails;
