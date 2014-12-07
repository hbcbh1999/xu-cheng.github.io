#
# A small utility to manager my website.
#
# Copyright (c) 2014 Xu Cheng
#

require "fileutils"
require "pathname"
require "rake"
require "yaml"

task :default => :watch

CONFIG = YAML.load_file("_config.yml")
DATE = Time.now.strftime("%Y-%m-%d")

class String
  def undent
    gsub(/^.{#{slice(/^ +/).length}}/, '')
  end
end

# Transform the filename and date to a slug
def transform_to_slug(title, extension)
  characters = /("|'|!|\?|:|\s\z)/
  whitespace = /\s/
  "#{title.gsub(characters,"").gsub(whitespace,"-")}.#{extension}"
end

# rake build
desc "Build the site"
task :build do
  sh "jekyll", "build"
end

# rake watch
# rake watch["drafts"]
desc "Serve and watch the site"
task :watch, :draft do |t, args|
  shell_args = %w[jekyll serve --watch]
  shell_args << "--draft" if args[:draft] == "draft"
  begin
    # no backtrace
    std_trap = trap("INT") { exit! 130 }
    sh *shell_args
  ensure
    # restore default CTRL-C handler
    trap("INT", std_trap)
  end
end

# rake preview
desc "Launch a preview of the site in the browser"
task :preview do
  port = CONFIG["port"]
  if port.nil? or port.empty?
    port = 4000
  end
  Thread.new do
    sleep 3
    puts "Launching browser for preview..."
    sh "open", "http://localhost:#{port}/"
  end
  Rake::Task[:watch].invoke
end

def write_post_or_draft path, title
  raise "File #{path} already existed." if path.exist?
  puts "Createing file #{path}."
  FileUtils.mkdir_p path.dirname
  path.open("w") do |f|
    f.write <<-EOS.undent
      ---
      layout: post
      title: "#{title}"
      description: ""
      category:
      tags: []
      ---
    EOS
  end
end

# rake post
# rake post["title"]
desc "Create a post in _posts"
task :post, :title do |t, args|
  title = args[:title]
  while title.nil? or title.empty?
    print "Input new post title: "
    title = STDIN.gets.strip
  end
  filename = "#{DATE}-#{transform_to_slug(title, "md")}"
  filepath = Pathname.new("_posts/#{filename}")
  write_post_or_draft filepath, title
end

# rake draft
# rake draft["title"]
desc "Create a draft in _drafts"
task :draft, :title do |t, args|
  title = args[:title]
  while title.nil? or title.empty?
    print "Input new draft title: "
    title = STDIN.gets.strip
  end
  filename = "#{transform_to_slug(title, "md")}"
  filepath = Pathname.new("_drafts/#{filename}")
  write_post_or_draft filepath, title
end

# rake publish
desc "Move a post from _drafts to _posts"
task :publish do
  files = Dir["_drafts/*"]
  abort if files.empty?
  puts "Choose the draft to publish:"
  files.each_with_index do |file, index|
    puts "#{index + 1}: #{file}".sub("_drafts/", "")
  end
  print "> "
  number = $stdin.gets
  if number =~ /\D/
    filename = files[number.to_i - 1].sub("_drafts/", "")
    newfilename = "#{DATE}-#{filename}"
    path = "_drafts/#{filename}"
    newpath = "_posts/#{newfilename}"
    puts "Moving #{path} to #{newpath}"
    FileUtils.mv path, newpath
  else
    puts "Please choose a draft by the assigned number."
  end
end
