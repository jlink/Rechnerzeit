package net.rechnerzeit

import grails.converters.JSON

class SessionController {

    def show() {
        println("show")
        println(params.id)

        render(contentType:"text/json") {
            program = '//Vom Server'
        }
    }

    def update() {
        println("update")
        println(params)

        render(contentType:"text/json") {
            info(success: false)
        }
    }

    def save() {
        println("save")
        println(params)

        render(text: '1235');
    }

    def delete() {
        println("delete")
        println(params)

        render(contentType:"text/json") {
            info(success: false)
        }
    }

}
