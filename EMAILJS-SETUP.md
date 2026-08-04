# Como fazer o formulário de contato enviar e-mail de verdade

O formulário da seção "Contato" do site (wtsitelab) até agora era só uma
**simulação**: ao enviar, o JavaScript mostrava uma mensagem de sucesso, mas
nada era realmente enviado — por isso o e-mail nunca chegava.

Agora ele está pronto para enviar de verdade usando o **EmailJS**, um serviço
gratuito que manda e-mail direto do navegador, sem precisar de servidor.
Funciona em qualquer hospedagem (Netlify, Vercel, cPanel, o que você já
estiver usando) — não precisa trocar nada na hospedagem.

**Plano gratuito:** até 200 e-mails por mês, mais que suficiente para um
formulário de contato.

---

## Passo a passo (leva uns 10 minutos)

### 1. Crie uma conta gratuita

Acesse [emailjs.com](https://www.emailjs.com) → **Sign Up** → crie a conta
(pode ser com o próprio `wtsitelab@gmail.com`).

### 2. Conecte seu e-mail (Service)

No painel, vá em **Email Services → Add New Service**.

- Escolha **Gmail** (já que o e-mail de contato é `wtsitelab@gmail.com`)
- Clique em **Connect Account** e autorize com a conta do Gmail
- Depois de criado, copie o **Service ID** (algo como `service_abc1234`)

### 3. Crie o modelo de e-mail (Template)

Vá em **Email Templates → Create New Template**. Configure:

- **To email**: `wtsitelab@gmail.com` (para onde a mensagem vai chegar)
- **From name**: `{{nome}}`
- **Reply To**: `{{email}}` *(assim, quando você responder o e-mail que
  chegar, a resposta vai direto pro cliente, não para você mesmo)*
- **Subject**: algo como `Novo contato pelo site — {{nome}}`
- **Content** (corpo do e-mail), por exemplo:

```
Novo contato recebido pelo site WT Site Lab:

Nome: {{nome}}
E-mail: {{email}}
Segmento do negócio: {{segmento}}
Tipo de projeto: {{tipo}}

Mensagem:
{{mensagem}}
```

Salve e copie o **Template ID** (algo como `template_xyz789`).

### 4. Copie sua Public Key

Vá em **Account → General** e copie a **Public Key**.

### 5. Edite o `script.js`

Perto do topo do arquivo, procure por:

```js
const EMAILJS_PUBLIC_KEY = 'SUA_PUBLIC_KEY_AQUI';
const EMAILJS_SERVICE_ID = 'SEU_SERVICE_ID_AQUI';
const EMAILJS_TEMPLATE_ID = 'SEU_TEMPLATE_ID_AQUI';
```

Substitua os 3 valores pelos que você copiou nos passos 2, 3 e 4.

### 6. Suba o site atualizado

Publique o `index.html` e o `script.js` atualizados na sua hospedagem
(o mesmo processo que você já usou da primeira vez).

### 7. Teste

Preencha o formulário no site publicado e confira se o e-mail chega em
`wtsitelab@gmail.com` (pode cair na aba **Promoções** ou em **Spam** na
primeira vez — marque como "não é spam" se acontecer).

---

## Por que não funcionava antes?

Um site **estático** (só HTML/CSS/JS, sem servidor por trás) não tem como,
sozinho, enviar e-mail — um formulário HTML puro só sabe *mostrar* campos,
não *enviar* nada para lugar nenhum sem alguém processando esse envio do
outro lado. Por isso toda solução (EmailJS, Netlify Forms, Formspree etc.)
depende de um serviço externo fazendo esse trabalho.

## Alternativa (se você hospedar no Netlify)

Se em algum momento você mudar a hospedagem para o **Netlify**, existe uma
opção ainda mais simples chamada *Netlify Forms*, que não exige nenhum
cadastro externo — é só adicionar um atributo no HTML. Se quiser seguir por
esse caminho no futuro, é só pedir que eu adapto o formulário.
