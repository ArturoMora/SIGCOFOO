namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraAptitudesLike : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.cat_Aptitudes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Nombre = c.String(nullable: false),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "GEN.tab_AptitudesEmpleado",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        AptitudesCatId = c.String(nullable: false),
                        ClaveEmpleado = c.String(nullable: false),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "GEN.tab_LikesLinked",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Aprobador = c.String(nullable: false),
                        Empleado = c.String(nullable: false),
                        Tipo = c.String(nullable: false),
                        IdExteno = c.String(nullable: false),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "GEN.cat_Likes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Nombre = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("GEN.cat_Likes");
            DropTable("GEN.tab_LikesLinked");
            DropTable("GEN.tab_AptitudesEmpleado");
            DropTable("GEN.cat_Aptitudes");
        }
    }
}
