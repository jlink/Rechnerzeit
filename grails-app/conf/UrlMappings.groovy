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
		"500"(view:'/error')
	}
}
