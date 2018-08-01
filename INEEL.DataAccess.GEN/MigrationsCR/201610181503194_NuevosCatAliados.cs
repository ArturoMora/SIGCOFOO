namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NuevosCatAliados : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.cat_Ambito",
                c => new
                    {
                        AmbitoId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(nullable: false, maxLength: 50),
                        Descripcion = c.String(maxLength: 300),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AmbitoId)
                .Index(t => t.Nombre, unique: true);
            
            CreateTable(
                "CR.cat_TipoOrganizacion",
                c => new
                    {
                        TipoOrganizacionId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(nullable: false, maxLength: 50),
                        Descripcion = c.String(maxLength: 300),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.TipoOrganizacionId)
                .Index(t => t.Nombre, unique: true);
            
        }
        
        public override void Down()
        {
            DropIndex("CR.cat_TipoOrganizacion", new[] { "Nombre" });
            DropIndex("CR.cat_Ambito", new[] { "Nombre" });
            DropTable("CR.cat_TipoOrganizacion");
            DropTable("CR.cat_Ambito");
        }
    }
}
