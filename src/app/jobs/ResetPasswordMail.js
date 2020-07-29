const { sendMail } = require('../../libs/Mail')

module.exports = {
  key: 'ResetPasswordMail',

  async handle({ data }) {
    const { name, email, token } = data

    await sendMail({
      to: `${name} <${email}>`,
      subject: 'Redefinição de senha',
      template: 'reset_password',
      context: { name, email, token },
    })
  },
}
