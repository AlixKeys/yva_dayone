"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Menu, X, Compass, BookOpen, FileText, Heart, Star, ChevronRight } from "lucide-react"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)
  }, [])

  const features = [
    {
      icon: <Compass className="w-8 h-8 text-blue-400" />,
      title: "Orientation intelligente",
      description: "Tests personnalisés pour découvrir votre voie idéale",
      badge: "Populaire",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-blue-400" />,
      title: "Mini-formations",
      description: "Cours pratiques adaptés au marché togolais",
      badge: "Nouveau",
    },
    {
      icon: <FileText className="w-8 h-8 text-blue-400" />,
      title: "Génération de documents",
      description: "CV, lettres de motivation et pitchs professionnels",
      badge: "IA",
    },
    {
      icon: <Heart className="w-8 h-8 text-blue-400" />,
      title: "Soutien moral",
      description: "Accompagnement personnalisé pour rester motivé",
      badge: "24/7",
    },
  ]

  const testimonials = [
    {
      name: "Koffi Mensah",
      role: "Étudiant en médecine",
      content: "YVA m'a aidé à découvrir ma passion pour la médecine. Les tests d'orientation sont vraiment précis !",
      rating: 5,
      avatar: "https://api.dicebear.com/9.x/identicon/svg?seed=koffi&backgroundColor=2563eb&size=60",
    },
    {
      name: "Ama Togo",
      role: "Développeuse web",
      content: "Grâce aux mini-formations, j'ai pu acquérir les compétences nécessaires pour mon métier de rêve.",
      rating: 5,
      avatar: "https://api.dicebear.com/9.x/identicon/svg?seed=ama&backgroundColor=2563eb&size=60",
    },
    {
      name: "Edem Kpodzi",
      role: "Entrepreneur",
      content: "Le générateur de CV m'a permis de créer un profil professionnel qui m'a ouvert de nombreuses portes.",
      rating: 5,
      avatar: "https://api.dicebear.com/9.x/identicon/svg?seed=edem&backgroundColor=2563eb&size=60",
    },
  ]

  const stats = [
    { number: "5000+", label: "Jeunes accompagnés" },
    { number: "150+", label: "Formations disponibles" },
    { number: "98%", label: "Taux de satisfaction" },
    { number: "24/7", label: "Support disponible" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <span className="text-2xl font-bold text-blue-400">YVA</span>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-blue-200 hover:text-blue-400 transition-colors">
                Fonctionnalités
              </Link>
              <Link href="#testimonials" className="text-blue-200 hover:text-blue-400 transition-colors">
                Témoignages
              </Link>
              <Link href="#about" className="text-blue-200 hover:text-blue-400 transition-colors">
                À propos
              </Link>
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700">Dashboard</Button>
                </Link>
              ) : (
                <div className="flex space-x-4">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                    >
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700">Inscription</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Menu Mobile */}
            <button className="md:hidden text-blue-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Menu Mobile Dropdown */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden py-4 border-t border-slate-700"
            >
              <div className="flex flex-col space-y-4">
                <Link href="#features" className="text-blue-200 hover:text-blue-400 transition-colors">
                  Fonctionnalités
                </Link>
                <Link href="#testimonials" className="text-blue-200 hover:text-blue-400 transition-colors">
                  Témoignages
                </Link>
                <Link href="#about" className="text-blue-200 hover:text-blue-400 transition-colors">
                  À propos
                </Link>
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700 w-full">Dashboard</Button>
                  </Link>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white w-full bg-transparent"
                      >
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="bg-blue-600 hover:bg-blue-700 w-full">Inscription</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold text-blue-100 mb-6">
              Votre avenir commence avec <span className="text-blue-400">YVA</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              L'assistant virtuel qui accompagne les jeunes Togolais dans leur orientation scolaire, professionnelle et
              leur développement personnel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                    Accéder au Dashboard
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                      Commencer gratuitement
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-lg px-8 py-4 bg-transparent"
                    >
                      Se connecter
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-blue-200 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-blue-100 mb-6">Nos fonctionnalités</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Des outils intelligents pour vous accompagner à chaque étape de votre parcours
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700 hover:border-blue-500 transition-all duration-300 h-full">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">{feature.icon}</div>
                    <div className="flex justify-center mb-2">
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-blue-100 text-lg font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-blue-200 leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-slate-800/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-blue-100 mb-6">Ce que disent nos utilisateurs</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Découvrez comment YVA transforme la vie des jeunes Togolais
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700 h-full">
                  <CardHeader className="text-center">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-blue-400"
                    />
                    <CardTitle className="text-blue-100 text-lg">{testimonial.name}</CardTitle>
                    <CardDescription className="text-blue-400">{testimonial.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-blue-200 italic leading-relaxed">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Prêt à transformer votre avenir ?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de jeunes qui utilisent YVA pour construire leur parcours professionnel
            </p>
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4">
                  Accéder à mon Dashboard
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4">
                  Commencer maintenant
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-800 border-t border-slate-700">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Y</span>
                </div>
                <span className="text-2xl font-bold text-blue-400">YVA</span>
              </div>
              <p className="text-blue-200 text-sm">Votre compagnon pour un avenir meilleur au Togo</p>
            </div>

            <div>
              <h3 className="text-blue-100 font-semibold mb-4">Fonctionnalités</h3>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>
                  <Link href="/orientation" className="hover:text-blue-400 transition-colors">
                    Orientation
                  </Link>
                </li>
                <li>
                  <Link href="/formations" className="hover:text-blue-400 transition-colors">
                    Formations
                  </Link>
                </li>
                <li>
                  <Link href="/generation" className="hover:text-blue-400 transition-colors">
                    Génération
                  </Link>
                </li>
                <li>
                  <Link href="/motivation" className="hover:text-blue-400 transition-colors">
                    Motivation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-blue-100 font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>
                  <Link href="/help" className="hover:text-blue-400 transition-colors">
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-400 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-blue-400 transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-blue-100 font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-blue-400 transition-colors">
                    Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-blue-200 text-sm">
              © 2025 YVA - Votre compagnon pour un avenir meilleur. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
