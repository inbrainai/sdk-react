require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = package["name"]
  s.version      = package["version"]
  s.description  = package["description"]
  s.summary      = "Monetization surveys for apps, powered by inBrain.ai."

  s.license      = package["license"]

  s.author       = package["author"]
  s.homepage     = "https://github.com/inbrainai/sdk-react"

  
  s.platforms    = { :ios => "12.0" }
  s.source       = { :git => "https://github.com/inbrainai/sdk-react.git", :tag => "#{s.version}" }

  s.source_files = "ios/*.{h,m,swift}"

  s.dependency "React"
  s.dependency 'InBrainSurveys', '~> 2.5.0'

end
