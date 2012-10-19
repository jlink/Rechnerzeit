package net.rechnerzeit

import grails.converters.JSON

class SessionController {

    def show() {
        println(params.id)
        println(session.isNew())

        render(contentType:"text/json") {
            info(success: false)
        }
    }
}
