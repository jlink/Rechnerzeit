package net.rechnerzeit

class SessionController {
    def userSessionService

    def show() {
        log.debug("show session: $params.id")

        def userSession = userSessionService.get(params.id)
//        log.debug("show session: $userSession")
        renderAnswer(userSession)
    }

    private void renderAnswer(userSession) {
        if (userSession) {
            renderUserSession(userSession)
        } else {
            render(contentType: "text/json") {
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
            showingCourse = userSession.showingCourse
            lastChangeDate = userSession.lastChangeDate
        }
    }

    def update() {
        log.debug("update session: $params.id")

        def userSession = params2userSession(params)
//        log.debug("update session: $userSession")
        userSession = userSessionService.update(userSession)
        renderAnswer(userSession)
    }

    def save() {
        def userSession = params2userSession(params)
        userSession = userSessionService.save(userSession)
        log.debug("save new session: $userSession.id")
        renderUserSession(userSession)
    }

    def delete() {
        log.debug("delete session: $params.id")

        render(contentType:"text/json") {
            error = true
            reason = 'Deleting sessions not yet implemented'
        }
    }

    private params2userSession(params) {
        params.subMap(['id', 'lastChangeDate', 'program', 'continuousExecution', 'showingCourse'])
    }

}
