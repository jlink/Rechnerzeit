package net.rechnerzeit

class SessionController {
    def userSessionService

    def show() {
        println("show: $params.id")

        def userSession = userSessionService.get(params.id)
        if (userSession) {
    //        println(userSession)
            renderUserSession(userSession)
        } else {
            render(contentType:"text/json") {
                error = true
                reason = "No stored session with id $params.id"
            }
            return;
        }
    }

    private void renderUserSession(userSession) {
        render(contentType: "text/json") {
            id = userSession.id
            program = userSession.program
            continuousExecution = userSession.continuousExecution
        }
    }

    def update() {
        println("update")

        def userSession = params2userSession(params)
//        println(userSession)
        userSession = userSessionService.update(userSession)
        renderUserSession(userSession)
    }

    def save() {
        println("save: $params.id")

        def userSession = params2userSession(params)
//        println(userSession)
        userSession = userSessionService.save(userSession)
//        println(userSession)
        renderUserSession(userSession)
    }

    def delete() {
        println("delete: $params.id")

        render(contentType:"text/json") {
            info(success: true)
        }
    }

    private params2userSession(params) {
        params.subMap(['id', 'lastChangeDate', 'program', 'continuousExecution'])
    }

}
