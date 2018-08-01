namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PersonalInternoGI : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_IntegranteGrupoColegiadoInterno",
                c => new
                    {
                        IntegranteGrupoColegiadoInternoId = c.Int(nullable: false, identity: true),
                        GrupoColegiadoPartIntId = c.Int(nullable: false),
                        ClaveEmpleado = c.String(),
                        Nombre = c.String(maxLength: 250),
                        CargoGC = c.String(nullable: false, maxLength: 50),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.IntegranteGrupoColegiadoInternoId)
                .ForeignKey("CR.tab_GrupoColegiadoPartInt", t => t.GrupoColegiadoPartIntId, cascadeDelete: true)
                .Index(t => t.GrupoColegiadoPartIntId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_IntegranteGrupoColegiadoInterno", "GrupoColegiadoPartIntId", "CR.tab_GrupoColegiadoPartInt");
            DropIndex("CR.tab_IntegranteGrupoColegiadoInterno", new[] { "GrupoColegiadoPartIntId" });
            DropTable("CR.tab_IntegranteGrupoColegiadoInterno");
        }
    }
}
