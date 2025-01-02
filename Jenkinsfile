pipeline {
    agent any

    environment {
        DEPLOY_SERVER = 'ubuntu@3.124.192.157'    // Remote deployment server
        BOOKS_SERVICE_DIR = '/home/ubuntu/eBooks-API'  // Directory for the eBooks API on the server
        GIT_REPO = 'git@github.com:Zaiidmo/eBooks-API.git'  // GitHub repository URL
    }

    tools {
        nodejs 'NodeJS 20.0.0'  // Define Node.js version
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm  // Checkout the code from the GitHub repository
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'  // Install dependencies
            }
        }

        stage('Test') {
            steps {
                // Run tests
                sh 'npm test'  // Run tests if any
            }
        }

        stage('Build') {
            steps {
                // Build the application (you can define any build steps here if needed)
                sh 'npm run build'  // Run the build process
            }
        }

        stage('Deploy to Books-Service') {
            steps {
                sshagent(['jenkins-slave-key']) {
                    script {
                        // SSH into the deployment server and deploy the code
                        // Ensure the books-service is pulled and restarted
                        sh """
                            ssh -o StrictHostKeyChecking=no $DEPLOY_SERVER "
                                cd $BOOKS_SERVICE_DIR && \
                                git pull origin master && \
                                npm install && \
                                pm2 restart eBooks-API || pm2 start npm --name 'eBooks-API' -- start
                            "
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
