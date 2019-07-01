import * as prettier from 'prettier'
import { writeFile } from 'fs'

export function core(blueprint) {
  const pages = blueprint.view.pages
  const blocks = blueprint.view.blocks
  let result = ''

  const common = (commonParts: any) => {
    if (commonParts) {
      return {
        header: commonParts.header
          ? `
               <nav class="blue darken-3" role="navigation">
                    <div class="nav-wrapper container"><a id="logo-container" href="#" class="brand-logo">${commonParts.header.logo}</a>
                    <ul class="right hide-on-med-and-down">
                        <li>
                            <a href="${commonParts.header.links[0].url}">${commonParts.header.links[0].name}</a>
                        </li>
                    </ul>

                    <ul id="nav-mobile" class="sidenav">
                        <li><a href="${commonParts.header.links[0].url}">${commonParts.header.links[0].name}</a>
                        </li>
                    </ul>
                    <a href="#" data-target="nav-mobile" class="sidenav-trigger"><i class="material-icons">menu</i></a>
                    </div>
                </nav>
             `
          : '',
        footer: commonParts.footer
          ? `
        <footer class="page-footer blue darken-3">
            <div class="footer-copyright">
            <div class="container">
            Made by <a class="blue-text text-lighten-3" href="http://htmlfromjson.com">${blueprint.info.authorName}</a>
            </div>
            </div>
        </footer>
      `
          : ''
      }
    } else {
      return {
        header: '',
        footer: ''
      }
    }
  }

  const filler = (page: any) => {
    console.log('------------------------------------->', page.name)
    return page.sections
      .map((section: any) => {
        let block = blocks.find(o => o.id === section)
        if (block) {
          return block.rows
            .map((row, i) => {
              let columnsHtml
              if (row.columns) {
                columnsHtml = row.columns
                  .map(column => {
                    let gridColumns = row.columns.length
                    return `
                  <div class="col s12 m${12 / gridColumns}">
                    <div class="icon-block">
                      <h2 class="center light-blue-text"><i class="material-icons">flash_on</i></h2>
                      <h5 class="center">${column.title}</h5>
                      <p class="light">${column.text}</p>
                    </div>
                  </div>
              `
                  })
                  .join('')
              }
              return `<div class="row center">${columnsHtml}</div>`
            })
            .join('')
        }
      })
      .join('')
  }

  pages.forEach(page => {
    result = ''
    result = prettier.format(
      `
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
        <title>${blueprint.info.projectName}</title>

        <!-- CSS  -->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link href="css/materialize.css" type="text/css" rel="stylesheet" media="screen,projection"/>
        <link href="css/style.css" type="text/css" rel="stylesheet" media="screen,projection"/>
        </head>
        <body>
            ${common(blueprint.view.common).header}
            <div class="container">
            ${filler(page)}
            </div>
            ${common(blueprint.view.common).footer}
            <!--  Scripts-->
            <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
            <script src="js/materialize.js"></script>
            <script src="js/init.js"></script>
        </body>
    </html>
    `,
      { parser: 'html', htmlWhitespaceSensitivity: 'ignore' }
    )
    writeFile(__dirname + `/../../dist/${page.name}.html`, result, err => {
      if (err) {
        return console.log(err)
      }
      console.log(`${page.name}.html saved!`)
    })
  })
}
