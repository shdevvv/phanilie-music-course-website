export interface Sheet {
  title: string
  description: string
  price: string
  genres: ('Jazz' | 'Gospel' | 'Christmas' | 'Disney')[]
  image: string
  previews: string[]
}

export const sheets: Sheet[] = [
  {
    title: 'Mercy in the Keys',
    description: 'A deep, soulful gospel arrangement focusing on inner-voice movements and substitution chords in Ab Major.',
    price: '$5.00',
    genres: ['Gospel', 'Jazz'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE01bt9AYJJSfbLvQOrNr8djRYWDCUzj2y8eh1A28x4dJakdHj-Vrfn-5EsKac2q0Ox2_7g-ajVuaG4hAOWk7H5GR3L7uoDE5pbPPozItFks8XHmPoUS3g-chWI7ApFNTqa9_LOPiSr8hYXY-wQfjzoZqtJRDvrJnE6pEUFxem7ZYD-AUlvFhP3-u_DpPk5ebA9vWLKfARmvmPv2Zts7vz-2LPF7fQwCdPSydWcqhfT_w4-XZWzzI',
    previews: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCsRy2SOJJJasUiHkKEcxT2fL9fn0jnl1b7rCdcDclVDhqMh212jWIwzjyHzcoaexobcmzvCQ5Pcmw_y84q289Y5jGP66OxTs15-vh5WsQaZb11YU52YX_-vh0m32jS2bs_m5uBA0BV3HzJLfSnlnFmT2Z1rozbxKq5t_oQB6IgNNUOdKUvFifXQqeiVWommnnTOFr-uUkqnx1RhQHnPQMxLQlw1DTri_qcrPomEsKUTq7Mb02Hg80',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBVzTJVsTn5Nm-l1RJ5T4f0drzHOYUnDU0E_NjKIT4JAC7LsBzm0lSw-j7u7wtK6sKwvB27ZoIe2Hr9Zq4r4jZ8-yZ1kQAQpaG-fwbfarfvmt43ok7TKpXlys4cGkwpNDl75A8yO2rRjp0PJ0rKbtmdmW3hGn6C6aeg7_3KN9hFlou7X5wlkoh2_X3_vDqkT4kwW7iFblTHBbUF9ImOZAzIb2ocHIpQgK81uUN66_AuyitqIWt5WAk'
    ]
  },
  {
    title: 'Soulful Progression Vol. 1',
    description: 'Master the 2-5-1 in all 12 keys with these elegant gospel-infused jazz turnarounds.',
    price: '$5.00',
    genres: ['Jazz', 'Gospel'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACLZu1J6KszJvYZBl6xwK-Y3Z9c8BsOlUfK0gEohrIEM6dZfiMzuaLHrxIlJMeuJ1ypt5sb_cm2njaTsOKgDaiz16CL5hIMYwex_AAMiBCwwUDc4-08KE3nrRR3ad-eEnZlmTSJioSNschvEg0V6lEhHqlts01toV4ASkFGvt3L1EmsXe5KoLz-mjAXpMtBqu-adTwZBxq3LmhNdVtyeIu8n5y7WpGMtAkPnlhbOb930OSq7vuUY0',
    previews: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCsRy2SOJJJasUiHkKEcxT2fL9fn0jnl1b7rCdcDclVDhqMh212jWIwzjyHzcoaexobcmzvCQ5Pcmw_y84q289Y5jGP66OxTs15-vh5WsQaZb11YU52YX_-vh0m32jS2bs_m5uBA0BV3HzJLfSnlnFmT2Z1rozbxKq5t_oQB6IgNNUOdKUvFifXQqeiVWommnnTOFr-uUkqnx1RhQHnPQMxLQlw1DTri_qcrPomEsKUTq7Mb02Hg80',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBVzTJVsTn5Nm-l1RJ5T4f0drzHOYUnDU0E_NjKIT4JAC7LsBzm0lSw-j7u7wtK6sKwvB27ZoIe2Hr9Zq4r4jZ8-yZ1kQAQpaG-fwbfarfvmt43ok7TKpXlys4cGkwpNDl75A8yO2rRjp0PJ0rKbtmdmW3hGn6C6aeg7_3KN9hFlou7X5wlkoh2_X3_vDqkT4kwW7iFblTHBbUF9ImOZAzIb2ocHIpQgK81uUN66_AuyitqIWt5WAk'
    ]
  },
  {
    title: 'Fly Me to the Moon (Sheet)',
    description: "Note-for-note piano arrangement transcription of the popular YouTube jazz cover.",
    price: '$5.00',
    genres: ['Jazz'],
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80',
    previews: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCsRy2SOJJJasUiHkKEcxT2fL9fn0jnl1b7rCdcDclVDhqMh212jWIwzjyHzcoaexobcmzvCQ5Pcmw_y84q289Y5jGP66OxTs15-vh5WsQaZb11YU52YX_-vh0m32jS2bs_m5uBA0BV3HzJLfSnlnFmT2Z1rozbxKq5t_oQB6IgNNUOdKUvFifXQqeiVWommnnTOFr-uUkqnx1RhQHnPQMxLQlw1DTri_qcrPomEsKUTq7Mb02Hg80',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBVzTJVsTn5Nm-l1RJ5T4f0drzHOYUnDU0E_NjKIT4JAC7LsBzm0lSw-j7u7wtK6sKwvB27ZoIe2Hr9Zq4r4jZ8-yZ1kQAQpaG-fwbfarfvmt43ok7TKpXlys4cGkwpNDl75A8yO2rRjp0PJ0rKbtmdmW3hGn6C6aeg7_3KN9hFlou7X5wlkoh2_X3_vDqkT4kwW7iFblTHBbUF9ImOZAzIb2ocHIpQgK81uUN66_AuyitqIWt5WAk'
    ]
  },
  {
    title: 'O Holy Night (Sheet)',
    description: 'Lush, classical-jazz crossover arrangement for intermediate-to-advanced players.',
    price: '$5.00',
    genres: ['Christmas', 'Gospel'],
    image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=600&q=80',
    previews: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCsRy2SOJJJasUiHkKEcxT2fL9fn0jnl1b7rCdcDclVDhqMh212jWIwzjyHzcoaexobcmzvCQ5Pcmw_y84q289Y5jGP66OxTs15-vh5WsQaZb11YU52YX_-vh0m32jS2bs_m5uBA0BV3HzJLfSnlnFmT2Z1rozbxKq5t_oQB6IgNNUOdKUvFifXQqeiVWommnnTOFr-uUkqnx1RhQHnPQMxLQlw1DTri_qcrPomEsKUTq7Mb02Hg80',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBVzTJVsTn5Nm-l1RJ5T4f0drzHOYUnDU0E_NjKIT4JAC7LsBzm0lSw-j7u7wtK6sKwvB27ZoIe2Hr9Zq4r4jZ8-yZ1kQAQpaG-fwbfarfvmt43ok7TKpXlys4cGkwpNDl75A8yO2rRjp0PJ0rKbtmdmW3hGn6C6aeg7_3KN9hFlou7X5wlkoh2_X3_vDqkT4kwW7iFblTHBbUF9ImOZAzIb2ocHIpQgK81uUN66_AuyitqIWt5WAk'
    ]
  },
  {
    title: 'A Whole New World (Sheet)',
    description: 'Lyrical arrangement focusing on projecting melody with running arpeggios.',
    price: '$5.00',
    genres: ['Disney'],
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
    previews: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCsRy2SOJJJasUiHkKEcxT2fL9fn0jnl1b7rCdcDclVDhqMh212jWIwzjyHzcoaexobcmzvCQ5Pcmw_y84q289Y5jGP66OxTs15-vh5WsQaZb11YU52YX_-vh0m32jS2bs_m5uBA0BV3HzJLfSnlnFmT2Z1rozbxKq5t_oQB6IgNNUOdKUvFifXQqeiVWommnnTOFr-uUkqnx1RhQHnPQMxLQlw1DTri_qcrPomEsKUTq7Mb02Hg80',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBVzTJVsTn5Nm-l1RJ5T4f0drzHOYUnDU0E_NjKIT4JAC7LsBzm0lSw-j7u7wtK6sKwvB27ZoIe2Hr9Zq4r4jZ8-yZ1kQAQpaG-fwbfarfvmt43ok7TKpXlys4cGkwpNDl75A8yO2rRjp0PJ0rKbtmdmW3hGn6C6aeg7_3KN9hFlou7X5wlkoh2_X3_vDqkT4kwW7iFblTHBbUF9ImOZAzIb2ocHIpQgK81uUN66_AuyitqIWt5WAk'
    ]
  },
  {
    title: 'The Complete Soulful Progression',
    description: 'A comprehensive guide to modern harmony, from simple triads to complex 13th chords.',
    price: '$5.00',
    genres: ['Jazz', 'Gospel'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpOIR8QzOWX9JGCE3-qZBP-vOV0wO7Vtji-6RwQOLEZ-WRqqc9Bbe7Mi4getAYg1T9PL3qLn53OuvAeNzn4CAMWaUjPaIbTwnwe5wOhLbuc8rKCogpgFbdpTuqyqy-fLAIvsiwubOiig2CThny8PfP2vU57ctXYTHIFyKrRHjZyZrdsiugQtU9OsiyLezXQwUVAidGkmnStxic9Xc6HP5yhmekltbCjl3txUDyMV_8Rk1KoT4ox2g',
    previews: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCsRy2SOJJJasUiHkKEcxT2fL9fn0jnl1b7rCdcDclVDhqMh212jWIwzjyHzcoaexobcmzvCQ5Pcmw_y84q289Y5jGP66OxTs15-vh5WsQaZb11YU52YX_-vh0m32jS2bs_m5uBA0BV3HzJLfSnlnFmT2Z1rozbxKq5t_oQB6IgNNUOdKUvFifXQqeiVWommnnTOFr-uUkqnx1RhQHnPQMxLQlw1DTri_qcrPomEsKUTq7Mb02Hg80',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBVzTJVsTn5Nm-l1RJ5T4f0drzHOYUnDU0E_NjKIT4JAC7LsBzm0lSw-j7u7wtK6sKwvB27ZoIe2Hr9Zq4r4jZ8-yZ1kQAQpaG-fwbfarfvmt43ok7TKpXlys4cGkwpNDl75A8yO2rRjp0PJ0rKbtmdmW3hGn6C6aeg7_3KN9hFlou7X5wlkoh2_X3_vDqkT4kwW7iFblTHBbUF9ImOZAzIb2ocHIpQgK81uUN66_AuyitqIWt5WAk'
    ]
  },
  {
    title: 'Moon River (Sheet)',
    description: 'Elegant waltz jazz sheet music with detailed chord voicing diagrams and extensions.',
    price: '$5.00',
    genres: ['Jazz'],
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80',
    previews: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCsRy2SOJJJasUiHkKEcxT2fL9fn0jnl1b7rCdcDclVDhqMh212jWIwzjyHzcoaexobcmzvCQ5Pcmw_y84q289Y5jGP66OxTs15-vh5WsQaZb11YU52YX_-vh0m32jS2bs_m5uBA0BV3HzJLfSnlnFmT2Z1rozbxKq5t_oQB6IgNNUOdKUvFifXQqeiVWommnnTOFr-uUkqnx1RhQHnPQMxLQlw1DTri_qcrPomEsKUTq7Mb02Hg80']
  },
  {
    title: 'Amazing Grace (Sheet)',
    description: 'Gospel reharmonization arrangement score with modern neo-soul movement guides.',
    price: '$5.00',
    genres: ['Gospel'],
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=600&q=80',
    previews: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCsRy2SOJJJasUiHkKEcxT2fL9fn0jnl1b7rCdcDclVDhqMh212jWIwzjyHzcoaexobcmzvCQ5Pcmw_y84q289Y5jGP66OxTs15-vh5WsQaZb11YU52YX_-vh0m32jS2bs_m5uBA0BV3HzJLfSnlnFmT2Z1rozbxKq5t_oQB6IgNNUOdKUvFifXQqeiVWommnnTOFr-uUkqnx1RhQHnPQMxLQlw1DTri_qcrPomEsKUTq7Mb02Hg80']
  },
  {
    title: 'Bapa Sentuh Hatiku (Sheet)',
    description: 'Reflective Indonesian Christian sheet music score with smooth voicings.',
    price: '$5.00',
    genres: ['Gospel'],
    image: 'https://images.unsplash.com/photo-1442504028989-ab58b5f29a4a?auto=format&fit=crop&w=600&q=80',
    previews: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCsRy2SOJJJasUiHkKEcxT2fL9fn0jnl1b7rCdcDclVDhqMh212jWIwzjyHzcoaexobcmzvCQ5Pcmw_y84q289Y5jGP66OxTs15-vh5WsQaZb11YU52YX_-vh0m32jS2bs_m5uBA0BV3HzJLfSnlnFmT2Z1rozbxKq5t_oQB6IgNNUOdKUvFifXQqeiVWommnnTOFr-uUkqnx1RhQHnPQMxLQlw1DTri_qcrPomEsKUTq7Mb02Hg80']
  },
  {
    title: 'What a Wonderful World (Sheet)',
    description: 'Lush jazz piano solo sheet music with running left-hand chords.',
    price: '$5.00',
    genres: ['Jazz'],
    image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80',
    previews: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCsRy2SOJJJasUiHkKEcxT2fL9fn0jnl1b7rCdcDclVDhqMh212jWIwzjyHzcoaexobcmzvCQ5Pcmw_y84q289Y5jGP66OxTs15-vh5WsQaZb11YU52YX_-vh0m32jS2bs_m5uBA0BV3HzJLfSnlnFmT2Z1rozbxKq5t_oQB6IgNNUOdKUvFifXQqeiVWommnnTOFr-uUkqnx1RhQHnPQMxLQlw1DTri_qcrPomEsKUTq7Mb02Hg80']
  },
  {
    title: 'Over the Rainbow (Sheet)',
    description: 'Ballad jazz style sheet music with delicate voice leading and alterations.',
    price: '$5.00',
    genres: ['Jazz', 'Disney'],
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=600&q=80',
    previews: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCsRy2SOJJJasUiHkKEcxT2fL9fn0jnl1b7rCdcDclVDhqMh212jWIwzjyHzcoaexobcmzvCQ5Pcmw_y84q289Y5jGP66OxTs15-vh5WsQaZb11YU52YX_-vh0m32jS2bs_m5uBA0BV3HzJLfSnlnFmT2Z1rozbxKq5t_oQB6IgNNUOdKUvFifXQqeiVWommnnTOFr-uUkqnx1RhQHnPQMxLQlw1DTri_qcrPomEsKUTq7Mb02Hg80']
  },
  {
    title: 'Beauty and the Beast (Sheet)',
    description: 'Warm and lyrical Disney classic piano solo arrangement sheet music.',
    price: '$5.00',
    genres: ['Disney', 'Jazz'],
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    previews: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCsRy2SOJJJasUiHkKEcxT2fL9fn0jnl1b7rCdcDclVDhqMh212jWIwzjyHzcoaexobcmzvCQ5Pcmw_y84q289Y5jGP66OxTs15-vh5WsQaZb11YU52YX_-vh0m32jS2bs_m5uBA0BV3HzJLfSnlnFmT2Z1rozbxKq5t_oQB6IgNNUOdKUvFifXQqeiVWommnnTOFr-uUkqnx1RhQHnPQMxLQlw1DTri_qcrPomEsKUTq7Mb02Hg80']
  }
]
