class UrlMappings {

	static mappings = {
//		"/$controller/$action?/$id?"{
//			constraints {
//				// apply constraints here
//			}
//		}

		"/**"(view:"/single")
        "/impressum"(view:"/impressum")
        "/wasistdas"(view:"/wasistdas")
        "/credits"(view:"/credits")
        "/session/$id"(resource: 'session')
		"500"(view:'/error')
	}
}
