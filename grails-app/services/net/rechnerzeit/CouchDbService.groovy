package net.rechnerzeit

import groovyx.net.http.ContentType
import groovyx.net.http.EncoderRegistry
import groovyx.net.http.HttpResponseException
import groovyx.net.http.RESTClient
import org.codehaus.groovy.grails.commons.ConfigurationHolder

class CouchDbService {

    static transactional = false

    def couchDb

    CouchDbService() {
        EncoderRegistry encoders = new EncoderRegistry();
        encoders.setCharset('utf-8')
        couchDb = new RESTClient(couchdbUrl())
        if (couchdbUser())
            couchDb.auth.basic couchdbUser(), couchdbPw()
        couchDb.encoderRegistry = encoders
    }

    private couchdbUrl() {
        ConfigurationHolder.config.rechnerzeit.couchdb.url
    }

    private couchdbName() {
        ConfigurationHolder.config.rechnerzeit.couchdb.name
    }

    private couchdbUser() {
        ConfigurationHolder.config.rechnerzeit.couchdb.user
    }

    private couchdbPw() {
        ConfigurationHolder.config.rechnerzeit.couchdb.pw
    }

    def getSession(id) {
        try {
            def result = couchDb.get(path: "${couchdbName()}/$id", contentType: ContentType.JSON)
            return result.data
        } catch (HttpResponseException hre) {
            return null
        }
    }

    def saveSession(userSession) {
        userSession.'_id' = userSession.id
        def result = couchDb.post(path: couchdbName(), requestContentType: ContentType.JSON, body: userSession, contentType: ContentType.JSON)
        return userSession
    }

    def updateSession(userSession) {
        def storedSession = getSession(userSession.id)
        userSession.'_id' = storedSession.'_id'
        userSession.'_rev' = storedSession.'_rev'
        def result = couchDb.put(path: "${couchdbName()}/$userSession.id", requestContentType: ContentType.JSON, body: userSession, contentType: ContentType.JSON)
        return userSession
    }

}
