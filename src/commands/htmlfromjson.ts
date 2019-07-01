import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'htmlfromjson',
  run: async (toolbox: GluegunToolbox) => {
    const { print } = toolbox

    print.info(
      'Welcome to htmlfromjson! Plese use `htmlfromjson --help` to see the available commands'
    )
  }
}
