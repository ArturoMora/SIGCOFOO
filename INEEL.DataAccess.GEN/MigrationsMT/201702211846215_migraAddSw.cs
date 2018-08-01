namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraAddSw : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "MT.SoftwarePersonal",
                c => new
                    {
                        SoftwarePersonalId = c.Int(nullable: false, identity: true),
                        ProyectoId = c.String(maxLength: 10),
                        Nombre = c.String(nullable: false, unicode: false),
                        NumeroVersion = c.Single(),
                        AnioVersion = c.Int(),
                        DescripcionFuncional = c.String(unicode: false),
                        PlataformaDesarrollo = c.String(unicode: false),
                        TipoSoftwareId = c.Int(),
                        DerechoAutor = c.String(unicode: false),
                        Comentarios = c.String(unicode: false),
                        ManualTecnico = c.Long(),
                        ManualUsuario = c.Long(),
                        CodigoFuente = c.Long(),
                        TipoAcceso = c.Int(nullable: false),
                        Estado = c.Boolean(nullable: false),
                        GerenciaClave = c.String(),
                        ClavePersona = c.String(),
                        FechaValidacion = c.DateTime(),
                        EstadoFlujoId = c.Int(),
                    })
                .PrimaryKey(t => t.SoftwarePersonalId)
                .ForeignKey("GEN.Adjunto", t => t.CodigoFuente)
                .ForeignKey("GEN.Adjunto", t => t.ManualTecnico)
                .ForeignKey("GEN.Adjunto", t => t.ManualUsuario)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId)
                .ForeignKey("GEN.Proyectos", t => t.ProyectoId)
                .ForeignKey("MT.cat_TipoAcceso", t => t.TipoAcceso, cascadeDelete: true)
                .ForeignKey("MT.cat_TipoSoftware", t => t.TipoSoftwareId)
                .Index(t => t.ProyectoId)
                .Index(t => t.TipoSoftwareId)
                .Index(t => t.ManualTecnico)
                .Index(t => t.ManualUsuario)
                .Index(t => t.CodigoFuente)
                .Index(t => t.TipoAcceso)
                .Index(t => t.EstadoFlujoId);
            
            CreateIndex("MT.AutorSoftware", "SoftwarePersonalId");
            AddForeignKey("MT.AutorSoftware", "SoftwarePersonalId", "MT.SoftwarePersonal", "SoftwarePersonalId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("MT.AutorSoftware", "SoftwarePersonalId", "MT.SoftwarePersonal");
            DropForeignKey("MT.SoftwarePersonal", "TipoSoftwareId", "MT.cat_TipoSoftware");
            DropForeignKey("MT.SoftwarePersonal", "TipoAcceso", "MT.cat_TipoAcceso");
            DropForeignKey("MT.SoftwarePersonal", "ProyectoId", "GEN.Proyectos");
            DropForeignKey("MT.SoftwarePersonal", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("MT.SoftwarePersonal", "ManualUsuario", "GEN.Adjunto");
            DropForeignKey("MT.SoftwarePersonal", "ManualTecnico", "GEN.Adjunto");
            DropForeignKey("MT.SoftwarePersonal", "CodigoFuente", "GEN.Adjunto");
            DropIndex("MT.SoftwarePersonal", new[] { "EstadoFlujoId" });
            DropIndex("MT.SoftwarePersonal", new[] { "TipoAcceso" });
            DropIndex("MT.SoftwarePersonal", new[] { "CodigoFuente" });
            DropIndex("MT.SoftwarePersonal", new[] { "ManualUsuario" });
            DropIndex("MT.SoftwarePersonal", new[] { "ManualTecnico" });
            DropIndex("MT.SoftwarePersonal", new[] { "TipoSoftwareId" });
            DropIndex("MT.SoftwarePersonal", new[] { "ProyectoId" });
            DropIndex("MT.AutorSoftware", new[] { "SoftwarePersonalId" });
            DropTable("MT.SoftwarePersonal");
        }
    }
}
