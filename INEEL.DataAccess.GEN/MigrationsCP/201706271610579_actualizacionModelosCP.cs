namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class actualizacionModelosCP : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CP.tab_Especialistas", "IdAdjunto", "GEN.Adjunto");
            DropForeignKey("CP.tab_Especialistas", "IdComunidad", "CP.tab_Comunidades");
            DropIndex("CP.tab_Especialistas", new[] { "IdComunidad" });
            DropIndex("CP.tab_Especialistas", new[] { "IdAdjunto" });
            AddColumn("CP.tab_Autores", "FechaRegistro", c => c.DateTime(nullable: false));
            AddColumn("CP.tab_Comunidades", "TipoAcceso", c => c.Boolean(nullable: false));
            AddColumn("CP.tab_Post", "idComunidad", c => c.Int(nullable: false));
            AddColumn("CP.tab_MapasRuta", "Estatus", c => c.String());
            AlterColumn("CP.tab_Documento", "TipoAcceso", c => c.Boolean(nullable: false));
            AlterColumn("CP.tab_Documento", "Estado", c => c.String());
            AlterColumn("CP.tab_EstadoArte", "TipoAcceso", c => c.Boolean(nullable: false));
            AlterColumn("CP.tab_EstadoArte", "Estado", c => c.String());
            AlterColumn("CP.tab_EstudiosEspecializados", "TipoAcceso", c => c.Boolean(nullable: false));
            AlterColumn("CP.tab_EstudiosEspecializados", "Estado", c => c.String());
            AlterColumn("CP.tab_InformeAnual", "TipoAcceso", c => c.Boolean(nullable: false));
            AlterColumn("CP.tab_InformeAnual", "Estado", c => c.String());
            AlterColumn("CP.tab_MapasRuta", "TipoAcceso", c => c.Boolean(nullable: false));
            AlterColumn("CP.tab_PlanAnual", "TipoAcceso", c => c.Boolean(nullable: false));
            AlterColumn("CP.tab_TemasInnovacion", "TipoAcceso", c => c.Boolean(nullable: false));
            AlterColumn("CP.tab_TemasInnovacion", "Estado", c => c.String());
            CreateIndex("CP.tab_Post", "idComunidad");
            AddForeignKey("CP.tab_Post", "idComunidad", "CP.tab_Comunidades", "ComunidadId", cascadeDelete: false);
            DropColumn("CP.tab_MapasRuta", "Estado");
            DropTable("CP.tab_Especialistas");
        }
        
        public override void Down()
        {
            CreateTable(
                "CP.tab_Especialistas",
                c => new
                    {
                        EspecialistaId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        IdComunidad = c.Int(nullable: false),
                        TipoEspecialista = c.String(),
                        IdAdjunto = c.Long(),
                        idPersona = c.String(),
                        NumEmpleado = c.String(),
                        Especialidad = c.String(),
                        Correo = c.String(),
                        Empresa = c.String(),
                        FechaRegistro = c.DateTime(),
                    })
                .PrimaryKey(t => t.EspecialistaId);
            
            AddColumn("CP.tab_MapasRuta", "Estado", c => c.String());
            DropForeignKey("CP.tab_Post", "idComunidad", "CP.tab_Comunidades");
            DropIndex("CP.tab_Post", new[] { "idComunidad" });
            AlterColumn("CP.tab_TemasInnovacion", "Estado", c => c.Boolean(nullable: false));
            AlterColumn("CP.tab_TemasInnovacion", "TipoAcceso", c => c.String());
            AlterColumn("CP.tab_PlanAnual", "TipoAcceso", c => c.String());
            AlterColumn("CP.tab_MapasRuta", "TipoAcceso", c => c.String());
            AlterColumn("CP.tab_InformeAnual", "Estado", c => c.Boolean(nullable: false));
            AlterColumn("CP.tab_InformeAnual", "TipoAcceso", c => c.String());
            AlterColumn("CP.tab_EstudiosEspecializados", "Estado", c => c.Boolean(nullable: false));
            AlterColumn("CP.tab_EstudiosEspecializados", "TipoAcceso", c => c.String());
            AlterColumn("CP.tab_EstadoArte", "Estado", c => c.Boolean(nullable: false));
            AlterColumn("CP.tab_EstadoArte", "TipoAcceso", c => c.String());
            AlterColumn("CP.tab_Documento", "Estado", c => c.Boolean(nullable: false));
            AlterColumn("CP.tab_Documento", "TipoAcceso", c => c.String());
            DropColumn("CP.tab_MapasRuta", "Estatus");
            DropColumn("CP.tab_Post", "idComunidad");
            DropColumn("CP.tab_Comunidades", "TipoAcceso");
            DropColumn("CP.tab_Autores", "FechaRegistro");
            CreateIndex("CP.tab_Especialistas", "IdAdjunto");
            CreateIndex("CP.tab_Especialistas", "IdComunidad");
            AddForeignKey("CP.tab_Especialistas", "IdComunidad", "CP.tab_Comunidades", "ComunidadId", cascadeDelete: true);
            AddForeignKey("CP.tab_Especialistas", "IdAdjunto", "GEN.Adjunto", "AdjuntoId");
        }
    }
}
