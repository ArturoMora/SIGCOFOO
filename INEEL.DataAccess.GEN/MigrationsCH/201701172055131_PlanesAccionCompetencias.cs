namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PlanesAccionCompetencias : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_AreasMejoraCompetencia",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                        Estado = c.Int(nullable: false),
                        EmpleadoEvaluacionId = c.Int(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "CH.tab_FortalezasCompetencias",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                        Estado = c.Int(nullable: false),
                        EmpleadoEvaluacionId = c.Int(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "CH.tab_PlanAccionCompetencias",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                        Estado = c.Int(nullable: false),
                        EmpleadoEvaluacionId = c.Int(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("CH.tab_PlanAccionCompetencias");
            DropTable("CH.tab_FortalezasCompetencias");
            DropTable("CH.tab_AreasMejoraCompetencia");
        }
    }
}
