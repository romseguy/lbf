// A proposal for cherry picking Icons from @react-icons/all-files automatically
// https://github.com/react-icons/react-icons/issues/387

const iconsPrefix = {
  ai: "Ai",
  bi: "Bi",
  bs: "Bs",
  cg: "Cg",
  di: "Di",
  fa: "Fa",
  fc: "Fc",
  fi: "Fi",
  gi: "Gi",
  go: "Go",
  gr: "Gr",
  hi: "Hi",
  im: "Im",
  io: ["IoIos", "IoMd"],
  io5: "Io",
  md: "Md",
  ri: "Ri",
  si: "Si",
  ti: "Ti",
  vsc: "Vsc",
  wi: "Wi"
};

const resolveIcon = (name) => {
  const prefix = "@react-icons/all-files";

  for (let dir in iconsPrefix) {
    const iconDirPrefixes = Array.isArray(iconsPrefix[dir])
      ? iconsPrefix[dir]
      : [iconsPrefix[dir]];
    for (let icpIndex in iconDirPrefixes) {
      const iconDirPrefix = iconDirPrefixes[icpIndex];
      if (name.indexOf(iconDirPrefix) === 0) {
        return prefix + `/${dir}/` + name + ".js";
      }
    }
  }

  return prefix;
};

module.exports = {
  presets: ["next/babel", "@emotion/babel-preset-css-prop"],
  plugins: [
    "babel-plugin-macros",
    ...Object.keys(iconsPrefix).map((iconPrefix) => [
      "import",
      {
        libraryName: `react-icons/${iconPrefix}`,
        camel2DashComponentName: false,
        transformToDefaultImport: false,
        customName: resolveIcon
      },
      `react-icons/${iconPrefix}`
    ])
  ]
};
