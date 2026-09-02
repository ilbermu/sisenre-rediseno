import svgPaths from "./svg-w0fxxg1gzk";
import imgSignUp from "./032e40ba72541a29aef64c7150d660b7f04d7948.png";
type LogoEdenorProps = {
  className?: string;
  color?: "White";
  size?: "Isologo";
};

function LogoEdenor({ className, color = "White", size = "Isologo" }: LogoEdenorProps) {
  return (
    <div className={className || "h-[42.562px] relative w-[150.001px]"}>
      <div className="absolute inset-[17.82%_11.18%_0_0]" data-name="g5890">
        <svg className="absolute block inset-0 size-full" fill="none" height="34.9778" preserveAspectRatio="none" viewBox="0 0 133.229 34.9778" width="133.229">
          <g id="g5890">
            <path clipRule="evenodd" d={svgPaths.p195a5300} fill="white" fillRule="evenodd" id="Fill-1" />
            <path clipRule="evenodd" d={svgPaths.pc9a4d00} fill="white" fillRule="evenodd" id="Fill-4" />
            <path clipRule="evenodd" d={svgPaths.p14d300} fill="white" fillRule="evenodd" id="Fill-6" />
            <path clipRule="evenodd" d={svgPaths.p1c036700} fill="white" fillRule="evenodd" id="Fill-8" />
            <path clipRule="evenodd" d={svgPaths.p3faf0180} fill="white" fillRule="evenodd" id="Fill-10" />
            <path clipRule="evenodd" d={svgPaths.p4715600} fill="white" fillRule="evenodd" id="Fill-12" />
          </g>
        </svg>
      </div>
      <div className="absolute inset-[24.36%_0_49.96%_91.33%]" data-name="Fill-15">
        <svg className="absolute block inset-0 size-full" fill="none" height="10.9272" preserveAspectRatio="none" viewBox="0 0 13.0026 10.9272" width="13.0026">
          <path clipRule="evenodd" d={svgPaths.p36f75200} fill="white" fillOpacity="0.5" fillRule="evenodd" id="Fill-15" />
        </svg>
      </div>
      <div className="absolute inset-[0_0.95%_63%_88.06%]" data-name="Fill-18">
        <svg className="absolute block inset-0 size-full" fill="none" height="15.7497" preserveAspectRatio="none" viewBox="0 0 16.4774 15.7497" width="16.4774">
          <path clipRule="evenodd" d={svgPaths.p1770c600} fill="white" fillOpacity="0.5" fillRule="evenodd" id="Fill-18" />
        </svg>
      </div>
      <div className="absolute inset-[19.33%_1.14%_61.34%_91.27%]" data-name="Fill-20">
        <svg className="absolute block inset-0 size-full" fill="none" height="8.22837" preserveAspectRatio="none" viewBox="0 0 11.3791 8.22837" width="11.3791">
          <path clipRule="evenodd" d={svgPaths.p16e88a00} fill="white" fillRule="evenodd" id="Fill-20" />
        </svg>
      </div>
    </div>
  );
}

function Titulo() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full whitespace-nowrap" data-name="Titulo">
      <p className="font-['Asap:SemiBold',sans-serif] font-semibold leading-[40px] relative shrink-0 text-[#1d558c] text-[40px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`Bienvenido `}</p>
      <p className="font-['Nunito:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#52525b] text-[16px] tracking-[0.16px]">Ingresá tu usuario y contraseña</p>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Header">
      <Titulo />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center min-w-px relative" data-name="Label">
      <p className="[word-break:break-word] font-['Maven_Pro:Regular',sans-serif] font-normal leading-[20px] overflow-hidden relative shrink-0 text-[#52525b] text-[14px] text-ellipsis tracking-[0.14px] whitespace-nowrap">Usuario</p>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex gap-[2px] items-start relative shrink-0 w-full" data-name="Label">
      <Label1 />
    </div>
  );
}

function TextField() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Text Field">
      <div aria-hidden className="absolute border border-[#a1a1aa] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[8px] py-[12px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-w-px not-italic relative text-[#27272a] text-[14px] tracking-[0.14px]">{` `}</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Input">
      <Label />
      <TextField />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center min-w-px relative" data-name="Label">
      <p className="[word-break:break-word] font-['Maven_Pro:Regular',sans-serif] font-normal leading-[20px] overflow-hidden relative shrink-0 text-[#52525b] text-[14px] text-ellipsis tracking-[0.14px] whitespace-nowrap">Contraseña</p>
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex gap-[2px] items-start relative shrink-0 w-full" data-name="Label">
      <Label3 />
    </div>
  );
}

function TextField1() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Text Field">
      <div aria-hidden className="absolute border border-[#a1a1aa] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[8px] py-[12px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-w-px not-italic relative text-[#27272a] text-[14px] tracking-[0.14px]">{` `}</p>
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Input">
      <Label2 />
      <TextField1 />
    </div>
  );
}

function Inputs() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="Inputs">
      <Input />
      <Input1 />
    </div>
  );
}

function ButtonBase() {
  return (
    <div className="bg-[#4d97fa] flex-[1_0_0] min-w-px relative rounded-[4px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" data-name="_Button base">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[24px] py-[12px] relative size-full">
          <p className="[word-break:break-word] font-['Maven_Pro:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[16px] text-white whitespace-nowrap">Confirmar</p>
        </div>
      </div>
    </div>
  );
}

function InputsCta() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center relative rounded-[8px] shrink-0 w-full" data-name="Inputs & CTA">
      <Inputs />
      <div className="relative rounded-[8px] shrink-0 w-full" data-name="Button">
        <div className="content-stretch flex items-start relative size-full">
          <ButtonBase />
        </div>
      </div>
    </div>
  );
}

function Modal() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px relative w-full" data-name="Modal">
      <Header />
      <InputsCta />
    </div>
  );
}

function Bottom() {
  return (
    <div className="content-stretch flex items-end relative shrink-0 w-full" data-name="Bottom">
      <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Maven_Pro:Regular',sans-serif] font-normal h-full justify-end leading-[0] min-w-px relative text-[12px] text-black text-center tracking-[1px]">
        <p className="leading-[16px]">© Desarrollos propios 2026</p>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="bg-[#fafafa] flex-[1_0_0] min-h-px relative rounded-tl-[12px] rounded-tr-[12px] w-full" data-name="form">
      <div className="content-stretch flex flex-col gap-[50px] items-start pb-[32px] pt-[60px] px-[32px] relative size-full">
        <Modal />
        <Bottom />
      </div>
    </div>
  );
}

function ModalSignUp() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start max-h-[730px] min-h-px overflow-clip relative w-full" data-name="Modal Sign Up">
      <Form />
    </div>
  );
}

function Right() {
  return (
    <div className="flex flex-[1_0_0] h-full items-center justify-center min-w-px relative">
      <div className="-scale-y-100 flex-none rotate-180 size-full">
        <div className="relative size-full" data-name="Right">
          <div className="flex flex-col justify-end size-full">
            <div className="content-stretch flex flex-col items-start justify-end pt-[100px] px-[100px] relative size-full">
              <ModalSignUp />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Logo">
      <LogoEdenor className="col-1 h-[63px] ml-0 mt-0 relative row-1 w-[224px]" />
    </div>
  );
}

function Header1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Header">
      <div className="[word-break:break-word] flex flex-col font-['Maven_Pro:SemiBold',sans-serif] font-semibold justify-end leading-[0] relative shrink-0 text-[39.06px] text-white whitespace-nowrap">
        <p className="leading-[46.87px] mb-0">SISENRE</p>
        <p className="leading-[46.87px]">Calidad de servicio</p>
      </div>
    </div>
  );
}

function Texto() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Texto">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[50px] items-start justify-center p-[100px] relative size-full">
          <Logo />
          <Header1 />
        </div>
      </div>
    </div>
  );
}

function Left() {
  return (
    <div className="flex flex-[1_0_0] h-full items-center justify-center min-w-px relative">
      <div className="-scale-y-100 flex-none rotate-180 size-full">
        <div className="relative size-full" data-name="left">
          <div className="content-stretch flex flex-col items-start p-[50px] relative size-full">
            <Texto />
          </div>
        </div>
      </div>
    </div>
  );
}

function SignUp() {
  return (
    <div className="flex flex-[1_0_0] items-center justify-center min-h-px relative w-full z-[1]">
      <div className="-scale-y-100 flex-none rotate-180 size-full">
        <div className="content-stretch flex items-center justify-center overflow-clip relative size-full" data-name="Sign Up">
          <img alt="" className="absolute backdrop-blur-[39.9px] inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSignUp} />
          <Right />
          <Left />
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col isolate items-center relative size-full" data-name="Login">
      <SignUp />
    </div>
  );
}