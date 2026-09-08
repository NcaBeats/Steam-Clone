import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="w-full bg-[#171a21] text-[#8f98a0] text-xs py-8 border-t border-[#2a475e]/30 mt-auto">
            <div className="max-w-6xl mx-auto px-4 space-y-6">
                {/* Línea Superior: Logos y Copyright estilo Steam */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#2a475e]/20 pb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            <Image
                                src="/Logo.svg"
                                alt="Logo"
                                width={120}
                                height={36}
                                className="h-8 w-auto"
                            />
                        </Link>
                    </div>

                    <p className="text-center md:text-right text-[11px] leading-relaxed max-w-2xl">
                        © {new Date().getFullYear()} Proyecto Fullstack. Todos los derechos reservados.
                        Todas las marcas registradas pertenecen a sus respectivos dueños en EE.UU. y otros países.
                        Todos los precios incluyen IVA (donde sea aplicable).
                    </p>
                </div>

                {/* Línea Central: Enlaces de Navegación del Footer */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-[#c6d4df] font-medium">
                    <Link href="/about" className="hover:text-white transition-colors">
                        Acerca de
                    </Link>
                    <span className="text-[#2a475e]">•</span>
                    <Link href="/contact" className="hover:text-white transition-colors">
                        Contacto
                    </Link>
                    <span className="text-[#2a475e]">•</span>
                    <Link href="/blog" className="hover:text-white transition-colors">
                        Noticias y Blog
                    </Link>
                    <span className="text-[#2a475e]">•</span>
                    <a
                        href="https://store.steampowered.com/privacy_agreement/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                    >
                        Política de Privacidad
                    </a>
                    <span className="text-[#2a475e]">•</span>
                    <a
                        href="https://store.steampowered.com/legal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                    >
                        Información Legal
                    </a>
                </div>
            </div>
        </footer>
    );
}