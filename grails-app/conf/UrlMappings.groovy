class UrlMappings {

	static mappings = {
//		"/$controller/$action?/$id?"{
//			constraints {
//				// apply constraints here
//			}
//		}

        "/impressum"(view:"/impressum")
        "/wasistdas"(view:"/wasistdas")
        "/credits"(view:"/credits")
        "/session"(resource: 'session')
        "/session/$id"(resource: 'session')
		"/**"(view:"/single")
		"500"(view:'/error')
	}
}
