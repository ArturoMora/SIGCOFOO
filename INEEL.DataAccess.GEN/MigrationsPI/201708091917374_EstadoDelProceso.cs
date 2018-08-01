namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EstadoDelProceso : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "PI.cat_EstadoDelProcesoPI",
                c => new
                    {
                        EstadoDelProcesoId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                        DescripcionCorta = c.String(),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.EstadoDelProcesoId);
            
            AddColumn("PI.tab_PropiedadIndustrial", "EstadoDelProcesoId", c => c.Int(nullable: true));
            CreateIndex("PI.tab_PropiedadIndustrial", "EstadoDelProcesoId");
            AddForeignKey("PI.tab_PropiedadIndustrial", "EstadoDelProcesoId", "PI.cat_EstadoDelProcesoPI", "EstadoDelProcesoId", cascadeDelete: true);
            DropColumn("PI.tab_PropiedadIndustrial", "EstadoDelProceso");
        }
        
        public override void Down()
        {
            AddColumn("PI.tab_PropiedadIndustrial", "EstadoDelProceso", c => c.Int(nullable: false));
            DropForeignKey("PI.tab_PropiedadIndustrial", "EstadoDelProcesoId", "PI.cat_EstadoDelProcesoPI");
            DropIndex("PI.tab_PropiedadIndustrial", new[] { "EstadoDelProcesoId" });
            DropColumn("PI.tab_PropiedadIndustrial", "EstadoDelProcesoId");
            DropTable("PI.cat_EstadoDelProcesoPI");
        }
    }
}
