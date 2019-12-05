pipeline {
    agent {
        dockerfile {
                args '-v /tmp:/tmp -u node -p 3000:3000'
            }
    }
    environment {
            CI = 'true'
            HOME= '.'
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm -v'
                sh 'node --version'
                sh 'ls -la'
                sh 'whoami'
                sh 'npm ci'
            }
        }
         stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}