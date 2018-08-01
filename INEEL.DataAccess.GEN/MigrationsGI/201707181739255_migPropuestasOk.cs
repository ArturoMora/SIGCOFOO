namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migPropuestasOk : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.cat_EstadoPropuesta",
                c => new
                    {
                        Id = c.Int(nullable: false),
                        Nombre = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "GI.cat_PropuestaConIdea",
                c => new
                    {
                        IdeaId = c.Int(nullable: false),
                        PropuestaId = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.IdeaId);
            
            CreateTable(
                "GI.tab_PropuestaEnEstado",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        EstadoPropuestaId = c.Int(nullable: false),
                        Fecha = c.DateTime(nullable: false),
                        Justificacion = c.String(),
                        ClavePersona = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GI.cat_EstadoPropuesta", t => t.EstadoPropuestaId, cascadeDelete: true)
                .Index(t => t.EstadoPropuestaId);
            
            //DropColumn("GI.tab_EvaluadoresIdea", "ClavePersona");//Alan tiene esto en su rama
        }
        
        public override void Down()
        {
            //AddColumn("GI.tab_EvaluadoresIdea", "ClavePersona", c => c.String());
            DropForeignKey("GI.tab_PropuestaEnEstado", "EstadoPropuestaId", "GI.cat_EstadoPropuesta");
            DropIndex("GI.tab_PropuestaEnEstado", new[] { "EstadoPropuestaId" });
            DropTable("GI.tab_PropuestaEnEstado");
            DropTable("GI.cat_PropuestaConIdea");
            DropTable("GI.cat_EstadoPropuesta");
        }
    }
}
