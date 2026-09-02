import svgPaths from "./svg-skzom9442e";

function G() {
  return (
    <div className="absolute inset-[13.85%_10.59%_13.56%_10.59%]" data-name="g5902">
      <svg className="absolute block inset-0 size-full" fill="none" height="38.1567" preserveAspectRatio="none" viewBox="0 0 134 38.1567" width="134">
        <g id="g5902">
          <g id="g5890">
            <path clipRule="evenodd" d={svgPaths.p3efcfc00} fill="#1E558E" fillRule="evenodd" id="Fill-1" />
            <path clipRule="evenodd" d={svgPaths.p5a3f180} fill="#1E558E" fillRule="evenodd" id="Fill-4" />
            <path clipRule="evenodd" d={svgPaths.p2c9f0000} fill="#1E558E" fillRule="evenodd" id="Fill-6" />
            <path clipRule="evenodd" d={svgPaths.p3e0fb700} fill="#1E558E" fillRule="evenodd" id="Fill-8" />
            <path clipRule="evenodd" d={svgPaths.p3b162680} fill="#1E558E" fillRule="evenodd" id="Fill-10" />
            <path clipRule="evenodd" d={svgPaths.pa3e7800} fill="#1E558E" fillRule="evenodd" id="Fill-12" />
          </g>
          <path clipRule="evenodd" d={svgPaths.p74c0e80} fill="#4A96F9" fillOpacity="0.982808" fillRule="evenodd" id="Fill-15" />
          <path clipRule="evenodd" d={svgPaths.pa439900} fill="#01FB00" fillRule="evenodd" id="Fill-18" />
          <path clipRule="evenodd" d={svgPaths.p1d03c0c0} fill="#1E558E" fillRule="evenodd" id="Fill-20" />
        </g>
      </svg>
    </div>
  );
}

function EdenorLogo() {
  return (
    <div className="h-[52.562px] overflow-clip relative shrink-0 w-[170px]" data-name="Edenor-Logo 1">
      <G />
    </div>
  );
}

export default function Logo() {
  return (
    <div className="content-stretch flex items-start relative size-full" data-name="Logo">
      <EdenorLogo />
    </div>
  );
}