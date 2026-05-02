// Serverless Function — proxy para Google Gemini
// Recebe: { question, context }
// Retorna: { answer }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY não configurada' })
  }

  try {
    const { question, context } = req.body || {}

    const systemPrompt = `Você é um analista sênior de tráfego pago especializado em Meta Ads para B2B distribuidora, atuando na conta da HM Rio Embalagens Descartáveis — uma empresa de Piabetá-Magé, RJ, que distribui embalagens, descartáveis, sacolas, material de limpeza e produtos para comércios, deliveries, restaurantes, lanchonetes, mercados, festas e empresas em geral. Atendimento online, delivery, atacado e varejo, com entrega em até 24 horas no Rio de Janeiro.

Sua análise é fria, técnica, direta e acionável. Inspire-se em referências como Pedro Sobral, Mateus Zakur, Adriano Gianini e Thiago Finch.

Diretrizes:
- Considere o contexto B2B atacadista: ticket médio relevante, recorrência de compra, ciclo de venda mais longo que B2C, importância de leads qualificados via WhatsApp e canal direto de pedidos.
- Foque em insights granulares por nível: campanha, conjunto, criativo, orçamento, escala, fadiga.
- Aponte oportunidades concretas de otimização e escala, com números e percentuais.
- Use português brasileiro com tom consultivo e profissional, sem emojis.
- Para distribuidoras, recomende campanhas de WhatsApp (Mensagens) sempre que fizer sentido, pois costumam ter custo por lead 30 a 50% menor.
- Se faltar dado, peça especificamente o que precisa.
- Use negrito (**texto**) com moderação para destacar campanhas e métricas-chave.

Contexto atual das campanhas:
${context || 'Sem dados disponíveis no momento.'}`

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nPergunta: ${question}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      return res.status(500).json({ error: `Gemini retornou erro: ${errText}` })
    }

    const data = await response.json()
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Não consegui gerar uma resposta agora. Tente novamente em alguns segundos.'

    return res.status(200).json({ answer })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro desconhecido' })
  }
}
