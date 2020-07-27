const { sendMail } = require('../../libs/Mail')

module.exports = {
  key: 'SendPasswordMail',

  async handle({ data }) {
    const { name, email, password } = data

    await sendMail({
      to: `${name} <${email}>`,
      subject: 'Senha de acesso ao Foodfy',
      template: 'send_password',
      context: { name, password },
    })
  },
}
