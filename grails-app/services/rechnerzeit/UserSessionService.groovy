package rechnerzeit

class UserSessionService {

    static transactional = false

    static Map sessions = [:]
    static String idAlphabet = (('0'..'9')).join()

    def random = new Random()

    def get(id) {
        sessions[id]
    }

    def save(userSession) {
        String id = generateId()
        userSession.id = id
        sessions[id] = userSession
    }

    def update(userSession) {
        sessions[userSession.id] = userSession
    }

    def delete(id) {
        sessions.remove(id)
    }

    private generateId() {
        BigInteger newId = randomGenerator(13)
        if (sessions.containsKey(newId))
            return generateId()
        else
            return newId
    }

    private randomGenerator(int length) {
        BigInteger id = 0
        length.times {
            id = id * 10 + random.nextInt(10)
        }
        return id
    }
}
