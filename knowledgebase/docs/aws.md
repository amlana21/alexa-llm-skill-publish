AWS Well-Architected Framework Publication date: June 27, 2024 (Document revisions)

The AWS Well-Architected Framework helps you understand the pros and cons of decisions you make while building systems on AWS. By using the Framework you will learn architectural best practices for designing and operating reliable, secure, efficient, cost-effective, and sustainable systems in the cloud.

Introduction

The AWS Well-Architected Framework helps you understand the pros and cons of decisions you make while building systems on AWS. Using the Framework helps you learn architectural best practices for designing and operating secure, reliable, efficient, cost-effective, and sustainable workloads in the AWS Cloud. It provides a way for you to consistently measure your architectures against best practices and identify areas for improvement. The process for reviewing an architecture is a constructive conversation about architectural decisions, and is not an audit mechanism. We believe that having well-architected systems greatly increases the likelihood of business success.

AWS Solutions Architects have years of experience architecting solutions across a wide variety of business verticals and use cases. We have helped design and review thousands of customers’ architectures on AWS. From this experience, we have identified best practices and core strategies for architecting systems in the cloud.

The AWS Well-Architected Framework documents a set of foundational questions that help you to understand if a specific architecture aligns well with cloud best practices. The framework provides a consistent approach to evaluating systems against the qualities you expect from modern cloud- based systems, and the remediation that would be required to achieve those qualities. As AWS continues to evolve, and we continue to learn more from working with our customers, we will continue to refine the definition of well-architected.

This framework is intended for those in technology roles, such as chief technology officers (CTOs), architects, developers, and operations team members. It describes AWS best practices and strategies to use when designing and operating a cloud workload, and provides links to further implementation details and architectural patterns. For more information, see the AWS Well- Architected homepage.

    Introduction 1

AWS Well-Architected Framework Framework

 AWS also provides a service for reviewing your workloads at no charge. The AWS Well-Architected Tool (AWS WA Tool) is a service in the cloud that provides a consistent process for you to review and measure your architecture using the AWS Well-Architected Framework. The AWS WA Tool provides recommendations for making your workloads more reliable, secure, efficient, and cost- effective.

To help you apply best practices, we have created AWS Well-Architected Labs, which provides you with a repository of code and documentation to give you hands-on experience implementing best practices. We also have teamed up with select AWS Partner Network (APN) Partners, who are members of the AWS Well-Architected Partner program. These AWS Partners have deep AWS knowledge, and can help you review and improve your workloads.

Definitions

Every day, experts at AWS assist customers in architecting systems to take advantage of best practices in the cloud. We work with you on making architectural trade-offs as your designs evolve. As you deploy these systems into live environments, we learn how well these systems perform and the consequences of those trade-offs.

Based on what we have learned, we have created the AWS Well-Architected Framework, which provides a consistent set of best practices for customers and partners to evaluate architectures, and provides a set of questions you can use to evaluate how well an architecture is aligned to AWS best practices.

The AWS Well-Architected Framework is based on six pillars — operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability.

Table 1. The pillars of the AWS Well-Architected Framework

         Name

     Description

      Operational excellence

  The ability to support development and run workloads effectively, gain insight into their operations, and to continuously improve supporting processes and procedures to deliver business value.

      Security

    The security pillar describes how to take advantage of cloud technologies to protect

 Definitions 2
AWS Well-Architected Framework Framework

      Name

     Description

          data, systems, and assets in a way that can improve your security posture.

      Reliability

  The reliability pillar encompasses the ability of a workload to perform its intended function correctly and consistently when it’s expected to. This includes the ability to operate and test the workload through its total lifecycle

. This paper provides in-depth, best practice guidance for implementing reliable workloads on AWS.

      Performance efficiency

    The ability to use computing resources efficiently to meet system requirements, and to maintain that efficiency as demand changes and technologies evolve.

      Cost optimization

      The ability to run systems to deliver business value at the lowest price point.

      Sustainability

   The ability to continually improve sustainab ility impacts by reducing energy consumption and increasing efficiency across all component s of a workload by maximizing the benefits from the provisioned resources and minimizin g the total resources required.

 In the AWS Well-Architected Framework, we use these terms:

• Acomponentisthecode,configuration,andAWSResourcesthattogetherdeliveragainsta requirement. A component is often the unit of technical ownership, and is decoupled from other components.

• The term workload is used to identify a set of components that together deliver business value. A workload is usually the level of detail that business and technology leaders communicate about.

 Definitions 3



AWS Well-Architected Framework Framework

 • Wethinkaboutarchitectureasbeinghowcomponentsworktogetherinaworkload.How components communicate and interact is often the focus of architecture diagrams.

• Milestonesmarkkeychangesinyourarchitectureasitevolvesthroughouttheproductlifecycle (design, implementation, testing, go live, and in production).

• Withinanorganizationthetechnologyportfolioisthecollectionofworkloadsthatarerequired for the business to operate.

• Thelevelofeffortiscategorizingtheamountoftime,effort,andcomplexityataskrequiresfor implementation. Each organization needs to consider the size and expertise of the team and the complexity of the workload for additional context to properly categorize the level of effort for the organization.

• High:Theworkmighttakemultipleweeksormultiplemonths.Thiscouldbebrokenoutinto multiple stories, releases, and tasks.

• Medium:Theworkmighttakemultipledaysormultipleweeks.Thiscouldbebrokenoutinto multiple releases and tasks.

• Low:Theworkmighttakemultiplehoursormultipledays.Thiscouldbebrokenoutinto multiple tasks.

When architecting workloads, you make trade-offs between pillars based on your business context. These business decisions can drive your engineering priorities. You might optimize to improve sustainability impact and reduce cost at the expense of reliability in development environments, or, for mission-critical solutions, you might optimize reliability with increased costs and sustainability impact. In ecommerce solutions, performance can affect revenue and customer propensity to buy. Security and operational excellence are generally not traded-off against the other pillars.
